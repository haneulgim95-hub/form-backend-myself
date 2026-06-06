import { Request, Response } from "express";
import noticeService from "../../services/noticeService.ts";
import { NoticeInputType } from "../../schemas/admin/notice/noticeSchema.ts";

const createNotice = async (req: Request, res: Response) => {
    try {
        const { title, content }: NoticeInputType = req.body;
        const result = await noticeService.createNotice(title, content);
        res.status(201).json({ message: "공지사항을 성공적으로 생성했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "공지사항 생성 중 서버에러가 발생했습니다." });
    }
};

const updateNotice = async (req: Request<{ noticeId: string }>, res: Response) => {
    try {
        const noticeId = Number(req.params.noticeId);
        if (isNaN(noticeId)) {
            res.status(400).json({ message: "유효하지 않은 공지사항 ID 입니다." });
            return;
        }

        const { title, content }: NoticeInputType = req.body;
        const result = await noticeService.updateNotice(noticeId, title, content);
        res.status(200).json({ message: "공지사항이 성공적으로 수정되었습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_NOTICE") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 공지사항 입니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "공지사항을 수정하는 중 서버 에러가 발생했습니다." });
    }
};

const deleteNotice = async (req: Request<{ noticeId: string}>, res: Response) => {
    try {
        const noticeId = Number(req.params.noticeId);
        if (isNaN(noticeId)) {
            res.status(400).json({ message: "유효하지 않은 공지사항 ID 입니다." });
            return;
        }

        await noticeService.deleteNotice(noticeId);
        res.status(200).json({ message: "공지사항을 성공적으로 삭제했습니다"});
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_NOTICE") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 공지사항 입니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "공지사항을 수정하는 중 서버 에러가 발생했습니다." });
    }
};
export default { createNotice, updateNotice, deleteNotice };
