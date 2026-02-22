const userRouter = require("express").Router();
const {
  registerController,
  loginController,
  profileController,
  logoutController,
} = require("../controller/userController");
const { authMiddleware } = require("../middleware/auth.middleware");
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.post("/logout", logoutController);
userRouter.get("/profile", authMiddleware, profileController);
module.exports = { userRouter };
