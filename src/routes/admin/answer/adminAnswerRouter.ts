import { Router } from "express";
import { validate } from "../../../middlewares/validate.ts";
import { answerSchema } from "../../../schemas/answer/answerSchema.ts";
import adminAnswerController from "../../../controllers/admin/adminAnswerController.ts";

const router = Router();

router.post("/create/:inquiryId", validate(answerSchema), adminAnswerController.createAnswer);
router.patch("/update/:answerId", validate(answerSchema), adminAnswerController.updateAnswer);
router.delete("/delete/:answerId", adminAnswerController.deleteAnswer);

export default router;