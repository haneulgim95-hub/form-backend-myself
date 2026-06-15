import { Router } from "express";
import adminInquiryController from "../../../controllers/adminInquiryController.ts";

const router = Router();

router.get("/list", adminInquiryController.getInquiryList);
router.get("/:inquiryId", adminInquiryController.getInquiryById);

export default router;