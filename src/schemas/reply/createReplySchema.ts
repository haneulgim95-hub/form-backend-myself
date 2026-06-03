import {z} from "zod";

export const createReplySchema = z.object({
    content: z.string().min(1, "내용을 입력해주세요."),
    postId: z.number().positive("유효한 게시글 ID가 필요합니다."),
});

export type CreateReplyInputType = z.infer<typeof createReplySchema>;