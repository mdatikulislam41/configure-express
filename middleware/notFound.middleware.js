const { logger } = require("../utils/logger");

const notFound = (req, res, next) => {
  // if (req.originalUrl !== "/favicon.ico") {
  //   logger.warn(`404 Not Found: ${req.originalUrl}`);
  // }
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

module.exports = notFound;
