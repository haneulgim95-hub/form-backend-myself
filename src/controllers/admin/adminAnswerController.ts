import { Request, Response } from "express";
import { AnswerInputType } from "../../schemas/answer/answerSchema.ts";
import adminAnswerService from "../../services/admin/adminAnswerService.ts";

const createAnswer = async (req: Request<{ inquiryId: string }>, res: Response) => {
    try {
        const inquiryId = Number(req.params.inquiryId);
        if (isNaN(inquiryId)) {
            res.status(400).json({ message: "유효하지 않은 문의글 ID입니다." });
            return;
        }

        const { content }: AnswerInputType = req.body;
        const result = await adminAnswerService.createAnswer(inquiryId, content);
        res.status(201).json({ message: "답변을 성공적으로 등록했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error && error.message === "INQUIRY_NOT_FOUND") {
            res.status(404).json("존재하지 않거나 삭제된 문의글입니다.");
            return;
        }
        console.log(error);
        res.status(500).json({ message: "답변을 등록하는 중 서버 에러가 발생했습니다."});
    }
};

const updateAnswer = async (req: Request<{ answerId: string}>, res: Response) => {
    try {
        const answerId = Number(req.params.answerId);
        if (isNaN(answerId)) {
            res.status(400).json({ message: "유효하지 않은 답변 ID입니다." });
            return;
        }

        const { content }: AnswerInputType = req.body;

        const result = await adminAnswerService.updateAnswer(answerId, content);
        res.status(200).json({ message: "답변을 성공적으로 수정했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error && error.message === "INQUIRY_NOT_FOUND") {
            res.status(404).json("존재하지 않거나 삭제된 답변입니다.");
            return;
        }
        console.log(error);
        res.status(500).json({ message: "답변을 수정하는 중 서버 에러가 발생했습니다." });
    }
};

const deleteAnswer = async (req: Request<{ answerId: string }>, res: Response) => {
    try {
        const answerId = Number(req.params.answerId);
        if (isNaN(answerId)) {
            res.status(400).json({ message: "유효하지 않은 답변 ID입니다." });
            return;
        }

        await adminAnswerService.deleteAnswer(answerId);
        res.status(200).json({ message: "답변을 성공적으로 삭제했습니다." });
    } catch (error) {
        if (error instanceof Error && error.message === "INQUIRY_NOT_FOUND") {
            res.status(404).json("존재하지 않거나 삭제된 답변입니다.");
            return;
        }
        console.log(error);
        res.status(500).json({ message: "답변을 수정하는 중 서버 에러가 발생했습니다." });
    }
};

export default { createAnswer, updateAnswer, deleteAnswer };
