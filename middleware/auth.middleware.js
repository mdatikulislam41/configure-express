const jwt = require("jsonwebtoken");
require("dotenv").config();
const { logger } = require("../utils/logger");
const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "No token provided" });
    } else {
      const token = authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const { id, username, role } = decode;

      // req.username = username;
      // req.role = role;
      req.user = decode;
      next();
      // console.log(username, id, role);
    }
  } catch (err) {
    logger.error("Authentication failed");
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
module.exports = { authMiddleware };
