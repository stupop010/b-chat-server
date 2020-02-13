const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const checkAuth = require("../middleware/checkAuth");

const { fetchUser, loginUser } = require("../controllers/auth");

router.get("/", checkAuth, fetchUser);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .exists(),
    check("password").exists()
  ],
  loginUser
);

module.exports = router;
