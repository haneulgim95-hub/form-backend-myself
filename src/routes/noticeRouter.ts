import { Router } from "express";
import noticeController from "../controllers/noticeController.ts";

const router = Router();

router.get("/list", noticeController.getNoticeList);
router.get("/:noticeID", noticeController.getNoticeById);

export default router;
