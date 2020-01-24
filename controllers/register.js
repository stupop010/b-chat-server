const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const models = require("../models");
const jwtSign = require("../utils/jwtSign");

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, name, password } = req.body;

  try {
    // Query for a user if found user already exists, return 400.
    let user = await models.User.findOne({
      where: { email }
    });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // If no user found, save user to database.

    // Password hashing
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    user = await models.User.create({
      email,
      name,
      password: hashPassword
    });

    const userId = user.getDataValue("id");

    // Sign jwt tokens
    const response = jwtSign(userId);

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

module.exports = registerUser;
