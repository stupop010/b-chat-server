const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const registerUser = require("../controllers/register");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/",
  [
    check("email")
      .isEmail()
      .withMessage("email must be a email"),
    check("name")
      .notEmpty()
      .withMessage("name must not be empty"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 chars long")
  ],
  registerUser
);

module.exports = router;
