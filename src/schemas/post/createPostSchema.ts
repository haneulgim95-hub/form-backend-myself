import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "제목을 입력해주세요.").max(50, "제목은 50자를 초과할 수 없습니다."),
    content: z.string().min(1, "글 내용을 입력해주세요."),
    option1Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 작성해주세요.").optional(),
    option2Text: z.string().max(50, "투표 선택지 내용은 50자 이하로 작성해주세요.").optional(),
    categoryId: z.number().positive("유효한 카테고리 ID가 필요합니다."),
})

export type CreatePostInputType = z.infer<typeof createPostSchema>;