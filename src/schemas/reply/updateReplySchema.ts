import { z } from "zod";

export const updateReplySchema = z.object({
    content: z.string().min(1, "댓글 내용은 필수 입력 항목입니다."),
    id: z.number().positive("댓글Id가 유효하지 않습니다."),
});

export type UpdateReplyInputType = z.infer<typeof updateReplySchema>;