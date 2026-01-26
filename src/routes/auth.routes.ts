import { Router } from "express";
import { createUser } from "../controllers/auth.controller";
import { validate } from "../middlewares/valitadate";
import { createUserSchema } from "../schema/user.schema";
const router = Router();
router.post("/register", validate(createUserSchema), createUser);
export default router;
