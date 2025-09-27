import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../Controllers/authController.js";

import userAuth from "../middleware/userAuth.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-email", userAuth, verifyEmail);

export default authRouter;
{
  /*import express from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyEmail,
} from "../Controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);

// Protected routes
authRouter.post("/logout", userAuth, logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);

export default authRouter;*/
}
