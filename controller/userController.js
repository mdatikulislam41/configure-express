const { userMoules } = require("../module/user.modules");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const bcrypt = require("bcrypt");
const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = {
      username,
      email,
      password,
    };
    const user = await new userMoules(newUser);
    await user.save();
    logger.info(`New user registerd ${username}`);
    res.status(202).json("<h2>success</h2>");
  } catch (err) {
    logger.error(`register faild username: ${username}`);
  }
};
const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const findUser = await userMoules.findOne({ username });
    if (!findUser) {
      return res.status(505).json({ message: "user not found" });
    }

    // const isMacth = await bcrypt.compare(password, findUser.password);
    const isMacth = await findUser.comparePassword(password);
    if (!isMacth) {
      return res
        .status(505)
        .json({ message: "username or password not match" });
    } else {
      const loggedUser = {
        id: findUser._id,
        username: findUser.username,
        role: findUser.role,
      };
      const token = jwt.sign(loggedUser, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      res.status(200).json({
        success: true,
        message: "Login successful",
        token: "Bearer " + token,
      });
    }
  } catch (error) {
    res.status(505).json({ message: error.message });
  }
};
const profileController = async (req, res) => {
  res.status(202).json({ message: "success", info: req.user });
};
module.exports = { registerController, loginController, profileController };
