import { Router } from "express";
import postController from "../controllers/postController.ts";
import { validate } from "../middlewares/validate.ts";
import { createPostSchema } from "../schemas/post/createPostSchema.ts";
import { authenticate, checkUser } from "../middlewares/auth.ts";
import { votePostSchema } from "../schemas/post/votePostSchema.ts";

const router = Router();

router.get("/list/:categoryId", postController.getPostsByCategory);
router.get("/:id", checkUser, postController.getPostById);
router.post("/create", authenticate, validate(createPostSchema), postController.createPost);
router.post("/:postId/vote", authenticate, validate(votePostSchema), postController.votePost);
// votePost 기능을 만드려면 필요한것... userId, postId, option

export default router;