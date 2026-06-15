import { Request, Response } from "express";
import inquiryService from "../services/inquiryService.ts";
import { AuthRequest } from "../middlewares/auth.ts";

const getInquiryList = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        const result = await inquiryService.getInquiryList(page, size);
        res.status(200).json({ message: "문의 목록을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "문의 목록을 조회하는 중 서버 에러가 발생했습니다." });
    }
};

const getInquiryById = async (req: AuthRequest<{ inquiryId: string }>, res: Response) => {
    try {
        const inquiryId = Number(req.params.inquiryId);
        if (isNaN(inquiryId)) {
            res.status(400).json({ message: "유효하지 않은 문의글 ID입니다." });
            return;
        }

        const result = await inquiryService.getInquiryById(inquiryId);

        res.status(200).json({ message: "문의글을 성공적으로 조회헀습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "문의글을 조회하는 중 서버 에러가 발생했습니다." });
    }
};

export default { getInquiryList, getInquiryById };
