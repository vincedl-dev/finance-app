import { Router } from "express";
import { getTranscritions } from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.use(authenticate);
router.get("/", getTranscritions);

export default router;
