import { Router } from "express";
import postCotroller from "../controllers/postCotroller.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate, checkUser } from "../middlewares/auth.ts";
import { createPostSchema } from "../schemas/post/createPostSchema.ts";

const router = Router();

router.get("/list/:categoryId", postCotroller.getPostsByCategory);
router.get("/:id", checkUser, postCotroller.getPostById);
router.post("/create", authenticate, validate(createPostSchema), postCotroller.createPost );


export default router;