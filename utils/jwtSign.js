const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = id => {
  const payload = { id };
  const token = jwt.sign(payload, config.secret, {
    expiresIn: config.tokenLife
  });

  const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenLife
  });

  return (response = {
    token,
    refreshToken
  });
};
