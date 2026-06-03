import {Request, Response} from "express";
import replyService from "../services/replyService.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { CreateReplyInputType } from "../schemas/reply/createReplySchema.ts";

const createReply = async (req: AuthRequest, res: Response) => {
    try {
        // userId,  req.body(postId)
        if (!req.user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다."})
            return;
        }

        const userId = req.user.id;

        const { content, postId }: CreateReplyInputType = req.body;
        const result = await replyService.createReply(userId, postId, content);
        res.status(201).json({ message: "댓글을 성공적으로 등록했습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시글 입니다."});
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "댓글을 등록하는 중 서버 에러가 발생했습니다."});
    }
};

const getRepliesByPostId = async (req: Request<{ postId: string}>, res: Response) => {
    try {
         const postId = Number(req.params.postId);
         const page = Number(req.query.page) || 1;
         const size = Number(req.query.size) || 10;
         if (isNaN(postId)) {
             res.status(400).json({ message: "유효하지 않은 게시글 ID 입니다."});
             return;
         }
         const result = await replyService.getRepliesByPostId(postId, page, size);
         res.status(200).json({ message: "댓글 목록을 성공적으로 불러왔습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "댓글 목록을 조회하는 중 서버 에러가 발생했습니다." });
    }
};

export default { createReply, getRepliesByPostId };