const express = require("express");
const { userRouter } = require("./routes/user.Router");
const app = express();
const cookieparser = require("cookie-parser");

const { logger } = require("./utils/logger");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.get("/", (req, res) => {
  logger.info("হোম পেজে রিকোয়েস্ট এসেছে");
  res.send("Api running");
});
app.use(cookieparser);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
