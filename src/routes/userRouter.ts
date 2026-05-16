import { Router } from "express";
import userController from "../controllers/userController.ts";
import { createUserSchema } from "../schemas/user/createUser.ts";
import { validate } from "../middlewares/validate.ts";
import { loginSchema } from "../schemas/user/loginUser.ts";

const router = Router();

router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);

export default router;