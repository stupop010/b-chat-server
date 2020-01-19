let jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Token is not valid" }] });
      } else {
        console.log(decoded);
        req.user = decoded;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ errors: [{ msg: "Auth token is not supplied" }] });
  }
};
