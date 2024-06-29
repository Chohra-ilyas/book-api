const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controller/authorsController");

router
  .route("/")
  .get(getAllAuthors)
  .post(verifyTokenAndAdmin, createAuthor);

router
  .route("/:id")
  .get(getAuthorById)
  .put(verifyTokenAndAdmin, updateAuthor)
  .delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;
