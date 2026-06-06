import { Router } from "express";
import { validate } from "../../../middlewares/validate.ts";
import { noticeSchema } from "../../../schemas/admin/notice/noticeSchema.ts";
import adminNoticeController from "../../../controllers/admin/adminNoticeController.ts";

const router = Router();

// 공지사항 생성: 타이틀, 컨텐트, => 스키마
router.post("/create", validate(noticeSchema), adminNoticeController.createNotice);
// 공지사항 수정: 타이틀, 컨텐트, 공지사항ID
router.patch("/:noticeId", validate(noticeSchema), adminNoticeController.updateNotice);
// 공지사항 삭제: 공지사항아이디,
router.delete("/:noticeId", adminNoticeController.deleteNotice);

export default router;