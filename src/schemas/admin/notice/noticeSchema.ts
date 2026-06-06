import {z} from "zod";

export const noticeSchema = z.object({
    title: z.string().min(1, "공지사항 제목은 필수 입력 항목입니다.").max(255, "제목은 255자를 초과할 수 없습니다."),
    content: z.string().min(1, "공지사항 내용은 필수 입력 항목입니다.")
});

export type NoticeInputType = z.infer<typeof noticeSchema>;