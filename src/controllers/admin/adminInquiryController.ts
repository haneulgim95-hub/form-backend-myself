import {Request, Response} from "express";
import inquiryService from "../../services/inquiryService.ts";

const getInquiryList = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        const result = await inquiryService.getInquiryList(page, size);
        res.status(200).json({ message: "문의 목록을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "문의 목록 조회 중 서버 오류가 발생되었습니다.",
        });
    }
};



export default { getInquiryList };