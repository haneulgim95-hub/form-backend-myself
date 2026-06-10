import prisma from "../config/prisma.ts";

const getInquiryList = async (page: number, size: number) => {
    const total = await prisma.inquiry.count();

    const list = await prisma.inquiry.findMany({
        orderBy: {
            id: "desc",
        },
        skip: (page - 1) * size,
        take: size,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                },
            },
        },
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const getInquiryByID = async (inquiryId: number) => {
    const inquiry = await prisma.inquiry.findUnique({
        where: {
            id: inquiryId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                }
            }
        }
    });

    if (!inquiry) throw new Error("NOT_FOUND_INQUIRY");

    return inquiry;
};

const answerInquiry = async (inquiryId: number, answer?: string) => {
    await getInquiryByID(inquiryId);

    return prisma.inquiry.update({
        where: {
            id: inquiryId,
        },
        data: {
            answer: answer? answer : null,
            answeredAt: answer ? new Date() : null,
        },
    });
};

export default { getInquiryList, getInquiryByID, answerInquiry };
