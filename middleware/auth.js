const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).send("Token Required for authorization");
  }
  try {
    const decoded = jwt.verify(token, config.jwtsecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Invalid Token.");
  }
};
