const mongoose = require("mongoose");
const joi = require("joi");

const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

const validateCreateauthor = (obj) => {
  const schema = joi.object({
    firstName: joi.string().trim().min(3).max(200).required(),
    lastName: joi.string().trim().min(3).max(200).required(),
    nationality: joi.string().trim().min(2).max(100).required(),
  });

  return schema.validate(obj);
};

const validateUpdateauthor = (obj) => {
  const schema = joi.object({
    firstName: joi.string().trim().min(3).max(200),
    lastName: joi.string().trim().min(3).max(200),
    nationality: joi.string().trim().min(2).max(100),
  });

  return schema.validate(obj);
};

module.exports = {
  Author,
  validateCreateauthor,
  validateUpdateauthor,
};
