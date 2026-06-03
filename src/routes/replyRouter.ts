import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import replyController from "../controllers/replyController.ts";
import { createReplySchema } from "../schemas/reply/createReplySchema.ts";

const router = Router();

router.post("/create", authenticate, validate(createReplySchema), replyController.createReply)
router.get("/:postId", replyController.getRepliesByPostId);

export default router;