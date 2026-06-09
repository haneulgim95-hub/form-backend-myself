import { Request, Response} from "express";
import noticeService from "../services/noticeService.ts";

const getNoticeList = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 15;

        const result = await noticeService.getNoticeList(page, size);
        res.status(200).json({ message: "공지사항 목록을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "공지사항 목록을 조회하는 중 서버 에러가 발생했습니다."});
    }
};

const getNoticeById = async (req: Request<{ noticeId: string}>, res: Response) => {
    try {
        const id = Number(req.params.noticeId);
        if (isNaN(id)) {
            res.status(400).json({ message: "유효하지 않은 공지사항 ID입니다." });
            return;
        }

        const result = await noticeService.getNoticeById(id);
        res.status(200).json({ message: "공지사항을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: "공지사항이 존재하지 않거나 삭제되었습니다."});
            return;
        }
        console.log(error);
        res.status(500).json({ message: "공지사항 조회 중 서버 에러가 발생되었습니다."});
    }
};

export default {getNoticeList, getNoticeById};