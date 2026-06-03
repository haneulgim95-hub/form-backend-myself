import { Request, Response } from "express";
import { CreatePostInputType } from "../schemas/post/createPostSchema.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import postService from "../services/postService.ts";
import { VotePostInputType } from "../schemas/post/votePostSchema.ts";

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

const getPostById = async (req: AuthRequest<{id: string}>, res: Response) => {
    try {
        const postId = Number(req.params.id);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시글 ID 입니다."});
            return;
        }

        const userId = req.user?.id;

        const post = await postService.getPostById(postId, userId);
        res.status(200).json({ message: "게시글을 성공적으로 불러왔습니다.", data: post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다."});
    }
};


const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다."});
            return;
        }

        const { title, content, option1Text, option2Text, categoryId }: CreatePostInputType =
            req.body;
        const input: PostCreateInput = {
            title,
            content,
            option1Text: option1Text ?? null,
            option2Text: option2Text ?? null,
            category: { connect: { id: categoryId } },
            user: { connect: { id: user.id}},
        };

        const newData = await postService.createPost(input);
        res.status(201).json({ message: "게시글이 성공적으로 작성되었습니다.", data: newData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "게시글 작성 중 서버에러가 발생했습니다."});
    }
};

const votePost = async (req: AuthRequest<{postId: string}>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다."});
            return;
        }
        const userId = req.user.id;

        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({message: "유효하지 않은 게시글 ID 입니다."});
            return;
        }

        const { option }: VotePostInputType = req.body;
        await postService.votePost(userId, postId, option);
        res.status(200).json({ message: "투표가 성공적으로 진행되었습니다."})
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "NOT_FOUND") {
                res.status(404).json({ message: "존재하지 않거나 삭제된 게시물입니다." });
                return;
            }
            if (error.message === "NOT_VOTABLE") {
                res.status(400).json({ message: "투표가 활성화되지 않은 게시물입니다." });
                return;
            }
            if (error.message === "ALREADY_VOTED") {
                res.status(409).json({ message: "이미 투표에 참여하셨습니다." });
                return;
            }
        }
        console.log(error);
        res.status(500).json({ message: "투표 처리 중 서버 에러가 발생되었습니다." });
    }
};

export default { getPostsByCategory, createPost, getPostById, votePost };
