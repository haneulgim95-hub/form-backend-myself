import { z } from "zod";

export const answerSchema = z.object({
    content: z.string().min(1, "내용은 필수 입력 항목입니다."),
});

export type AnswerInputType = z.infer<typeof answerSchema>;
