import { Router } from "express";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";
import transactionRouter from "./transaction.routes";
const router = Router();
// You can define additional routes here and export the router if needed
router.use("/api/user", userRouter);
router.use("/api/auth", authRouter);
router.use("/api/transactions", transactionRouter);
export default router;
