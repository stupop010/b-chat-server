const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = id => {
  const payload = { id };
  const token = jwt.sign(payload, config.secret, {
    expiresIn: config.tokenLife
  });

  return (response = {
    token
  });
};
