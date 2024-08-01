const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  // get bearer token from headers of request
  const bearerToken = req.headers.authorization;
  // if bearer token is not available
  if (!bearerToken) {
    return res.send({ message: "Unauthorized access" });
  }
  // extract token from bearer token
  const token = bearerToken.split(" ")[1];
  // console.log("verify token", bearerToken, token);
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.log("error in verify token", err);
    next(err);
  }
}

module.exports = verifyToken;
