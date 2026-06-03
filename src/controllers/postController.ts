import { Request, Response } from "express";
import postService from "../services/postService.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { CreatePostInputType } from "../schemas/post/createPostSchema.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { VotePostInputType } from "../schemas/post/votePostSchema.ts";
import { VoteCreateInput } from "../generated/prisma/models/Vote.ts";
import postRouter from "../routes/postRouter.ts";

const getPostsByCategory = async (req: Request<{ categoryId: string }>, res: Response) => {
    try {
        const categoryId = Number(req.params.categoryId);
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        if (isNaN(categoryId)) {
            res.status(400).json({ message: "유효하지 않은 카테고리 ID입니다." });
            return;
        }

        const result = await postService.getPostsByCategory(categoryId, page, size);
        res.status(200).json({ message: "게시글 목록을 성공적으로 불러왔습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생되었습니다." });
    }
};

const getPostById = async (req: AuthRequest<{ postId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
            return;
        }
        const userId = req.user.id;

        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시글 ID 입니다." });
            return;
        }

        const result = await postService.getPostById(userId, postId);
        res.status(200).json({ message: "게시글을 성공적으로 불러왔습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "POST_NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시물입니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "게시글을 불러오는 중 서버 에러가 발생했습니다." });
    }
};

const createPost = async (req: AuthRequest, res: Response) => {
    try {
        // userId(어차피 authenticate통과 했음)
        // req.body
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
            return;
        }
        const userId = req.user.id;

        const { title, content, categoryId, option1Text, option2Text }: CreatePostInputType =
            req.body;

        const data: PostCreateInput = {
            title,
            content,
            category: { connect: { id: categoryId } },
            user: { connect: { id: userId } },
            option1Text: option1Text ?? null,
            option2Text: option2Text ?? null,
        };

        const result = await postService.createPost(data);
        res.status(201).json({ message: "게시글을 성공적으로 등록했습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "게시글을 등록하는 중 서버 에러가 발생헀습니다;"})
    }
};

const votePost = async (req: AuthRequest<{postId: string}>, res: Response) => {
    // userId(req.user.id), postId(req.params.id), req.body
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
            return;
        }
        const userId = req.user.id;

        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시글 ID입니다."});
            return;
        }

        const {option}: VotePostInputType = req.body;
        await postService.votePost(userId, postId, option);
        res.status(200).json({ message: "투표가 성공적으로 진행되었습니다."});
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "POST_NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시글 입니다."});
                return;
            }
            if (error.message === "NOT_VOTABLE") {
                res.status(400).json({ message: "투표가 활성화 되지 않은 게시글입니다."});
                return;
            }
            if (error.message === "ALREADY_VOTED") {
                res.status(409).json({ message: "이미 투표한 게시글 입니다."});
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "투표를 진행하는 중 서버 에러가 발생했습니다."});
    }
};

const cancelVotePost = async (req: AuthRequest<{postId: string}>, res: Response) => {
    try {
        // postId, userId
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자 입니다." });
            return;
        }
        const userId = req.user.id;

        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시글 ID입니다." });
            return;
        }

        await postService.cancelVotePost(postId, userId);
        res.status(200).json({ message: "투표 결과를 성공적으로 취소했습니다."});
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ message: "투표 결과가 존재하지 않습니다."});
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "투표를 취소하는 중 에러가 발생했습니다." });
    }
};

export default { getPostsByCategory, getPostById, createPost, votePost, cancelVotePost };
