const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ndm = require("nodemailer");
/**
 * @desc Get Forgot password view
 * @route /password/forgot-password
 * @method GET
 * @access public
 */
module.exports.getForgetpasswordView = asyncHandler((req, res) => {
  res.render("forgot-password");
});

/**
 * @desc Send Forgot password link
 * @route /password/forgot-password
 * @method POST
 * @access public
 */
module.exports.sendForgetpasswordLink = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "can't find this email!!" });
  }
  secret = process.env.JTW_SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret, {
    expiresIn: "15m",
  });
  const link = `http://localhost:3001/password/reset-password/${user._id}/${token}`;

  const transporter = ndm.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "reset password",
    html: `<div>
      <h4>click on the link below to reset your password</h4>
      <p>${link}</p>
    </div>`,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong!!!" });
    } else {
      console.log("Email sent" + success.response);
      res.render("link-send");
    }
  });
});

/**
 * @desc Get reset password link
 * @route /password/reset-password/:userId/:token
 * @method GET
 * @access public
 */
module.exports.getResetpasswordView = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "can't find this email!!" });
  }
  secret = process.env.JTW_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});

/**
 * @desc Reset password
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.setResetpassword = asyncHandler(async (req, res) => {
  const { error } = validateChangePassword(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "can't find this email!!" });
  }
  console.log(user);
  secret = process.env.JTW_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "error" });
  }
});
