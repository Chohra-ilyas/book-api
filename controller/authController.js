const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/User");

/**
 * @desc Register new User
 * @route /api/auth/register
 * @method POST
 * @access public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    res.status(400).json({ message: "user already exist!!" });
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const result = await user.save();
  const token = user.generateToken();

  const { password, ...other } = result._doc;

  res.status(201).json({ ...other, token });
});

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access public
 */

const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({ message: "user not exist!!" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordMatch) {
    const token = user.generateToken();
    const { password, ...other } = user._doc;
    res.status(200).json({ other, token });
  }

  res.status(201).json({ message: "wrong password!!" });
});

module.exports = {
  registerUser,
  loginUser,
};
