import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import replyController from "../controllers/replyController.ts";
import { createReplySchema } from "../schemas/reply/createReplySchema.ts";
import { updateReplySchema } from "../schemas/reply/updateReplySchema.ts";

const router = Router();

router.post("/create", authenticate, validate(createReplySchema), replyController.createReply)
router.get("/:postId", replyController.getRepliesByPostId);
router.delete("/:replyId", authenticate, replyController.deleteReply);
router.patch("/:replyId", authenticate, validate(updateReplySchema), replyController.updateReply);
// 댓글을 수정할때 필요한것: replyId,

export default router;