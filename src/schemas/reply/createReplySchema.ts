import {z} from "zod";

export const createReplySchema = z.object({
    content: z.string().min(1,"댓글 내용은 필수 입니다."),
    postId: z.number().positive("유효하지 않은 게시글 ID입니다."),
});

export type CreateReplyInputType = z.infer<typeof createReplySchema>;