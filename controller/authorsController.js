const asyncHandler = require("express-async-handler");
const {
  Author,
  validateUpdateauthor,
  validateCreateauthor,
} = require("../models/Author");

/**
 * @desc Get all authors
 * @route /api/authors
 * @method GET
 * @access public
 */
const getAllAuthors = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const authorPage = 2;
  const authorList = await Author.find()
    .skip((pageNumber - 1) * authorPage)
    .limit(authorPage)
    .select("firstName lastName -_id");
  res.status(200).json(authorList);
});

/**
 * @desc Get author by ID
 * @route /api/authors/:id
 * @method GET
 * @access public
 */
const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.status(200).json(author);
  } else {
    res.status(400).json({ message: "wrong id ,try another one!!" });
  }
});

/**
 * @desc add author
 * @route /api/authors
 * @method POST
 * @access private (only admin)
 */
const createAuthor = asyncHandler(async (req, res) => {
  const { error } = validateCreateauthor(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
  });

  result = await author.save();

  res.status(201).json(result);
});

/**
 * @desc Update author by ID
 * @route /api/authors/:id
 * @method PUT
 * @access private (only admin)
 */
const updateAuthor = asyncHandler(async (req, res) => {
  const { error } = validateUpdateauthor(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json(author);
});

/**
 * @desc delete author by ID
 * @route /api/authors/:id
 * @method DELETE
 * @access private (only admin)
 */
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = Author.findById(req.params.id);
  if (author) {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).send("author deleted seccessfully");
  }
  res.status(400).json({ message: "wrong id ,try another one!!" });
});

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
