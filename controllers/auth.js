const jwtSign = require("../utils/jwtSign");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const models = require("../models");

const fetchUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await models.User.findOne({
      attributes: { exclude: ["password"] },
      where: {
        id
      }
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await models.User.findOne({
      where: { email }
    });

    // If no user return error
    if (!user)
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

    const matchPassword = await bcrypt.compare(
      password,
      user.getDataValue("password")
    );

    // If passwords doesn't match, return with error
    if (!matchPassword)
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

    const userId = user.getDataValue("id");

    // Sign jwt Tokens
    const response = jwtSign(userId);

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

module.exports = {
  fetchUser,
  loginUser
};
