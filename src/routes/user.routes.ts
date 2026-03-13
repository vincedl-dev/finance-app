import { Router } from "express";
import {
  createUser,
  getUsers,
  specificUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/valitadate";
import { createUserSchema } from "../schema/auth.schema";

const router = Router();

router.get("/", getUsers);

router.get("/:id", specificUser);

export default router;
