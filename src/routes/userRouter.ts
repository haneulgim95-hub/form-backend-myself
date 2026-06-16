import { Router } from "express";
import userController from "../controllers/userController.ts";
import { createUserSchema } from "../schemas/user/createUser.ts";
import { validate } from "../middlewares/validate.ts";
import { loginSchema } from "../schemas/user/loginUser.ts";
import { updateUserSchema } from "../schemas/user/updateUserSchema.ts";
import { authenticate } from "../middlewares/auth.ts";
import { updatePasswordSchema } from "../schemas/user/updatePasswordSchema.ts";
import { withdrawUserSchema } from "../schemas/user/witherawUserSchema.ts";

const router = Router();

router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);
router.patch("/update", authenticate, validate(updateUserSchema), userController.updateUser);
router.patch(
    "/password",
    authenticate,
    validate(updatePasswordSchema),
    userController.updatePassword,
);
router.patch("/withdraw", authenticate, validate(withdrawUserSchema), userController.withdrawUser);


export default router;
