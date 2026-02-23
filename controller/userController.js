const { userMoules } = require("../module/user.modules");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const bcrypt = require("bcrypt");
const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

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
    const { username, password, device } = req.body;
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
      // const loggedUser = {
      //   id: findUser._id,
      //   username: findUser.username,
      //   role: findUser.role,
      // };
      // const token = jwt.sign(loggedUser, process.env.JWT_ACCESS_SECRET, {
      //   expiresIn: "10m",
      // });
      const accessToken = createAccessToken(findUser);
      const refreshToken = createRefreshToken(findUser);
      findUser.refreshTokens.push({ token: refreshToken, device });
      await findUser.save();

      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true, // production এ true
      //   sameSite: "strict",
      //   maxAge: 15 * 60 * 1000,
      // });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "strict",
      });

      res.json({ refreshToken });

      // res.status(200).json({
      //   success: true,
      //   message: "Login successful",
      //   token: "Bearer " + token,
      // });
    }
  } catch (error) {
    res.status(505).json({ message: error.message });
  }
};
// const logoutController = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.status(202).json({ message: "success" }); //response na korle cookie kaj kore na
//   } catch (err) {
//     res.status(505).json({ message: err.message });
//   }
// };
const logoutController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await userMoules.findOne({ "refreshTokens.token": token });
      if (user) {
        // Remove only this device token
        user.refreshTokens = user.refreshTokens.filter(
          (t) => t.token !== token,
        );
        await user.save();
      }
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(502).json({ message: err.message });
  }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userMoules.findById(decoded.id);
    if (!user) return res.status(403).json({ message: "User not found" });

    // Check if refresh token exists in DB (per-device)
    const tokenIndex = user.refreshTokens.findIndex((t) => t.token === token);
    if (tokenIndex === -1)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Create new tokens
    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    // Replace old refresh token (rotation)
    user.refreshTokens[tokenIndex].token = newRefreshToken;
    await user.save();

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh failed" });
  }
};
const profileController = async (req, res) => {
  res.status(202).json({ message: "success", info: req.user });
};

module.exports = {
  registerController,
  loginController,
  profileController,
  logoutController,
  refreshToken,
};
