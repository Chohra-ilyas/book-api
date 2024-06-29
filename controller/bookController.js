const asyncHandler = require("express-async-handler");
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/Book");

/**
 * @desc Get all books
 * @route /api/books
 * @method GET
 * @access public
 */
const getAllBooks = asyncHandler(async (req, res) => {
  const book = await Book.find().populate("author", [
    "firstName",
    "lastName",
    "_id",
    "nationality",
  ]);
  res.status(200).json(book);
});

/**
 * @desc Get book by ID
 * @route /api/books/:id
 * @method GET
 * @access public
 */
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author", [
    "firstName",
    "lastName",
    "_id",
    "nationality",
  ]);
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(400).json({ message: "wrong id ,try another one!!" });
  }
});

/**
 * @desc add book
 * @route /api/books
 * @method POST
 * @access private (only admin)
 */
const createBook = asyncHandler(async (req, res) => {
  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    cover: req.body.cover,
  });

  const result = await book.save();

  res.status(201).json(result);
});

/**
 * @desc Update bbok by ID
 * @route /api/books/:id
 * @method PUT
 * @access private (only admin)
 */
const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        cover: req.body.cover,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json(book);
});

/**
 * @desc delete book by ID
 * @route /api/books/:id
 * @method DELETE
 * @access private (only admin)
 */
const deleteBook = asyncHandler(async (req, res) => {
  const book = Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send("book deleted seccessfully");
  }
  res.status(400).json({ message: "wrong id ,try another one!!" });
});

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
