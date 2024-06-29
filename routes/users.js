const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controller/userController");

router.route("/").get(verifyTokenAndAdmin, getAllUsers);

router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById)
  .put(verifyTokenAndAuthorization, updateUser)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
