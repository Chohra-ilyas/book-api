const mongoose = require("mongoose");
const joi = require("joi");
const joipassword = require("joi-password-complexity")
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 5,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JTW_SECRET_KEY
  );
};

// user model
const User = mongoose.model("User", UserSchema);

//validation
const validateRegisterUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    username: joi.string().required().min(5).max(200).required(),
    password: joipassword().required(),
  });

  return schema.validate(obj);
};

const validateLoginUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).required().email(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(obj);
};

const validateChangePassword = (obj) => {
  const schema = joi.object({
    password: joipassword().required(),
  });

  return schema.validate(obj);
};

const validateUpdateUser = (obj) => {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(100).email(),
    username: joi.string().min(5).max(200),
    password: joipassword(),
  });

  return schema.validate(obj);
};

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
};
