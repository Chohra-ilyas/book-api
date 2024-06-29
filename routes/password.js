const express = require("express");
const {
  getForgetpasswordView,
  sendForgetpasswordLink,
  getResetpasswordView,
  setResetpassword,
} = require("../controller/passwordController");
const router = express.Router();

router
  .route("/forgot-password")
  .get(getForgetpasswordView)
  .post(sendForgetpasswordLink);

router
  .route("/reset-password/:userId/:token")
  .get(getResetpasswordView)
  .post(setResetpassword);

module.exports = router;
