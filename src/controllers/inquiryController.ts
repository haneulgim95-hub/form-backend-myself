import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import inquiryService from "../services/inquiryService.ts";
import { InquiryInputType } from "../schemas/inquiry/inquirySchema.ts";

const getInquiryList = async (req: AuthRequest, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const result = await inquiryService.getInquiryList(page, size, userId);
        res.status(200).json({ message: "문의글 목록을 성공적으로 조회했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "문의목록을 조회하는 중 서버에러가 발생헀습니다" });
    }
};

const getInquiryById = async (req: AuthRequest<{ inquiryId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const inquiryId = Number(req.params.inquiryId);
        if (isNaN(inquiryId)) {
            res.status(400).json({ message: "유효하지 않은 문의글 ID 입니다." });
            return;
        }

        const result = await inquiryService.getInquiryByID(inquiryId);
        if (result.userId !== userId) {
            res.status(403).json({ message: "해당 문의글을 조회할 권한이 없습니다." });
            return;
        }
        res.status(200).json({ message: "문의글을 성공적으로 조회했습니다", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "문의글을 조회하는 중 서버에러가 발생헀습니다" });
    }
};

const createInquiry = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const { title, content }: InquiryInputType = req.body;
        const result = await inquiryService.createInquiry(userId, title, content);
        res.status(201).json({ message: "문의글을 성공적으로 등록했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "문의글을 등록하는 중 서버에러가 발생헀습니다" });
    }
};

const updateInquiry = async (req: AuthRequest<{ inquiryId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const inquiryId = Number(req.params.inquiryId);
        if (isNaN(inquiryId)) {
            res.status(400).json({ message: "유효하지 않은 문의글 ID 입니다." });
            return;
        }

        const { title, content }: InquiryInputType = req.body;
        const result = await inquiryService.updateInquiry(inquiryId, userId, title, content);
        res.status(200).json({ message: "문의글을 성공적으로 수정했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_INQUIRY") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 문의글 입니다." });
                return;
            }
            if (error.message === "NOT_YOUR_INQUIRY") {
                res.status(403).json({ message: "해당 문의글을 수정할 권한이 없습니다." });
                return;
            }
            if (error.message === "ALREADY_ANSWERED_INQUIRY") {
                res.status(403).json({ message: "이미 답변이 달린 문의글은 수정할수 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "문의글을 수정하는 중 서버에러가 발생헀습니다" });
    }
};

const deleteInquiry = async (req: AuthRequest<{ inquiryId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
            return;
        }
        const userId = req.user.id;

        const inquiryId = Number(req.params.inquiryId);
        if (isNaN(inquiryId)) {
            res.status(400).json({ message: "유효하지 않은 문의글 ID 입니다." });
            return;
        }

        await inquiryService.deleteInquiry(inquiryId, userId);
        res.status(200).json({ message: "문의글을 성공적으로 삭제했습니다." });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND_INQUIRY") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 문의글 입니다." });
                return;
            }
            if (error.message === "NOT_YOUR_INQUIRY") {
                res.status(403).json({ message: "해당 문의글을 삭제할 권한이 없습니다." });
                return;
            }
            if (error.message === "ALREADY_ANSWERED_INQUIRY") {
                res.status(403).json({ message: "이미 답변이 달린 문의글은 삭제할수 없습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "문의글을 삭제하는 중 서버에러가 발생헀습니다" });
    }
};

export default { getInquiryList, getInquiryById, createInquiry, updateInquiry, deleteInquiry };
