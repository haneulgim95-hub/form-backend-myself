import { Request, Response } from "express";
import postService from "../services/postService.ts";
import { CreatePostInputType } from "../schemas/post/createPostSchema.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { AuthRequest } from "../middlewares/auth.ts";

const getPostsByCategory = async (req: Request<{ categoryId: string}>, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const size = Number(req.query.size) || 20;

        const categoryId = Number(req.params.categoryId);

        if (isNaN(categoryId)) {
            res.status(400).json({ message: "유효하지 않은 카테고리ID 입니다."});
            return;
        }

        const list = await postService.getPostsByCategory(categoryId, page, size);
        res.status(200).json({message: "게시글 목록을 성공적으로 불러왔습니다.", data: list});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다."});
    }
};

const getPostById = async (req: AuthRequest<{id: string}>, res: Response) => {
    try {
        const postId = Number(req.params.id);
        if (isNaN(postId)) {
            res.status(400).json({ message: "유효하지 않은 게시글 ID입니다."});
            return;
        }
        const userId = req.user?.id;

        const result = await postService.getPostById(postId, userId);
        res.status(200).json({ message: "게시글을 성공적으로 불러왔습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다."});
    }
};

const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({message: "로그인이 필요한 서비스입니다."});
        }
        const { title, content, option1Text, option2Text, categoryId }: CreatePostInputType = req.body;
        const input: PostCreateInput = {
            title,
            content,
            option1Text: option1Text ?? null,
            option2Text: option2Text ?? null,
            category: { connect: {id: categoryId}},
            user: { connect: {id: user.id}},
        }

        const result = await postService.createPost(input);
        res.status(201).json({ message: "게시글이 성공적으로 작성되었습니다.", data: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "게시글 작성 중 서버 에러가 발생되었습니다."});
    }
};

export default {getPostsByCategory, createPost, getPostById};