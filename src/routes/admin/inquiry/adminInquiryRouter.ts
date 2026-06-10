import { Router } from "express";
import adminInquiryController from "../../../controllers/admin/adminInquiryController.ts";

const router = Router();

router.get("/list", adminInquiryController.getInquiryList);

export default router;