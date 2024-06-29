const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");

/**
 * @desc GET Users
 * @route /api/users
 * @method GET
 * @access private (only Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find().select("-password");
  res.status(200).json(user);
});

/**
 * @desc Get user by ID
 * @route /api/users/:id
 * @method GET
 * @access private
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: "wrong id ,try another one!!" });
  }
});

/**
 * @desc Update User by ID
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json(updateUser);
});

/**
 * @desc delete user by ID
 * @route /api/users/:id
 * @method DELETE
 * @access private
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("author deleted seccessfully");
  }
  res.status(400).json({ message: "wrong id ,try another one!!" });
});

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
