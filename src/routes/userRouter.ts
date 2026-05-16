import { Router } from "express";
import userController from "../controllers/userController.ts";
import { createUserSchema } from "../schemas/user/createUser.ts";
import { validate } from "../middlewares/validate.ts";

const router = Router();

router.post("/create", validate(createUserSchema), userController.createUser);

export default router;