const mongoose = require("mongoose");
const joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 250,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);

const validateCreateBook = (obj) => {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(250).required(),
    author: joi.string().required(),
    price: joi.number().min(0).required(),
    cover: joi.string().valid("soft cover", "hard cover").required(),
  });

  return schema.validate(obj);
};

const validateUpdateBook = (obj) => {
  const schema = joi.object({
    title: joi.string().trim().min(3).max(200),
    author: joi.string(),
    price: joi.number().min(0),
    cover: joi.string().valid("soft cover", "hard cover"),
  });

  return schema.validate(obj);
};

module.exports = {
  Book,
  validateCreateBook,
  validateUpdateBook,
};
