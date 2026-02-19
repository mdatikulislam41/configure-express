const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Api running");
});
app.get((error, req, res, next) => {
  res.status(505).json({
    message: error.message,
  });
});
module.exports = app;
