import { Router } from "express";
import adminInquiryController from "../../../controllers/admin/adminInquiryController.ts";
import { validate } from "../../../middlewares/validate.ts";
import { inquiryAnswerSchema } from "../../../schemas/inquiry/InquiryAnswerSchema.ts";

const router = Router();

router.get("/list", adminInquiryController.getInquiryList);
router.get("/:inquiryId", adminInquiryController.getInquiryById);
router.patch("/:inquiryId", validate(inquiryAnswerSchema), adminInquiryController.answerInquiry);
router.delete("/:inquiryId", adminInquiryController.deleteAnswer);

export default router;