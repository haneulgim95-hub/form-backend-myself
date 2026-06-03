import { Router } from "express";
import replyController from "../controllers/replyController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import { createReplySchema } from "../schemas/reply/createReplySchema.ts";

const router = Router();

router.get("/:postId", replyController.getRepliesByPostId);
router.post("/create", authenticate, validate(createReplySchema), replyController.createReply);


export default router;