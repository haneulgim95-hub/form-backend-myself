import { Router } from "express";
import postController from "../controllers/postController.ts";
import { validate } from "../middlewares/validate.ts";
import { createPostSchema } from "../schemas/post/createPostSchema.ts";

const router = Router();

router.get("/list/:categoryId", postController.getPostsByCategory);
router.get("/create", validate(createPostSchema), );

export default router;