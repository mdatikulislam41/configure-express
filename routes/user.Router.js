const userRouter = require("express").Router();
const {
  registerController,
  loginController,
  profileController,
} = require("../controller/userController");
const { authMiddleware } = require("../middleware/auth.middleware");
userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/profile", authMiddleware, profileController);
module.exports = { userRouter };
