import { Router } from "express";
import {
  createUser,
  loginUser,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/valitadate";
import {
  createUserSchema,
  loginSchema,
  OtpSchema,
  forgotPasswordSchema,
} from "../schema/auth.schema";
import { loginUserService } from "../services/auth.service";
const router = Router();
router.post("/register", validate(createUserSchema), createUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/verify-account", validate(OtpSchema), verifyAccount);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(forgotPasswordSchema), resetPassword);
export default router;
