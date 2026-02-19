const express = require("express");
const { userRouter } = require("./routes/user.Router");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);
app.get("/", (req, res) => {
  res.send("Api running");
});
app.use((req, res) => {
  res.status(505).json({
    message: "not found",
  });
});
app.get((error, req, res, next) => {
  res.status(505).json({
    message: error.message,
  });
});
module.exports = app;
