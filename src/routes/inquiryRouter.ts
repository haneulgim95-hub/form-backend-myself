import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import inquiryController from "../controllers/inquiryController.ts";
import { validate } from "../middlewares/validate.ts";
import { inquirySchema } from "../schemas/inquiry/inquirySchema.ts";

const router = Router();

router.use(authenticate);

router.get("/list", inquiryController.getInquiryList);
router.get("/:inquiryId", inquiryController.getInquiryById);
router.post("/create", validate(inquirySchema), inquiryController.createInquiry);
router.patch("/edit/:inquiryId", validate(inquirySchema), inquiryController.updateInquiry);
router.patch("/:inquiryId", inquiryController.deleteInquiry);

export default router;
