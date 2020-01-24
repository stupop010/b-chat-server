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
    check("email").isEmail(),
    check("name").notEmpty(),
    check("password").isLength({ min: 6 })
  ],
  registerUser
);

module.exports = router;
