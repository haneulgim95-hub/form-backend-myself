import prisma from "../../config/prisma.ts";

const createAnswer = async (inquiryId: number, content: string) => {
    const inquiry = await prisma.inquiry.findFirst({
        where: {
            id: inquiryId,
            deletedAt: null,
        }
    })

    if (!inquiry) {
        throw new Error("INQUIRY_NOT_FOUND")
    }

    return prisma.answer.create({
        data: {
            inquiryId,
            content,
        }
    })
};

const updateAnswer = async (answerId: number, content: string) => {
    const answer = prisma.answer.findUnique({
        where: {
            id: answerId,
        }
    })
    if (!answer) {
        throw new Error("ANSWER_NOT_FOUND")
    }

    return prisma.answer.update({
        where: {
            id: answerId,
        },
        data: {
            content,
        },
    });
};

const deleteAnswer = async (answerId: number) => {
    const answer = prisma.answer.findUnique({
        where: {
            id: answerId,
        }
    })
    if (!answer) {
        throw new Error("ANSWER_NOT_FOUND")
    }

    return prisma.answer.delete({
        where: {
            id: answerId,
        }
    })
};

export default { createAnswer, updateAnswer, deleteAnswer };