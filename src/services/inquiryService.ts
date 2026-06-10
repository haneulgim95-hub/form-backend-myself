import prisma from "../config/prisma.ts";

const getInquiryList = async (page: number, size: number, userId?: number) => {
    const whereCondition = userId ? { userId } : {};
    const total = await prisma.inquiry.count({
        where: whereCondition,
    });

    const list = await prisma.inquiry.findMany({
        orderBy: {
            id: "desc",
        },
        skip: (page - 1) * size,
        take: size,
        where: whereCondition,
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

const createInquiry = async (userId: number, title: string, content: string) => {
    return prisma.inquiry.create({
        data: {
            title,
            content,
            userId,
        }
    })
};

const validateInquiryEditable = async (inquiryId: number, userId: number) => {
    const inquiry = await getInquiryByID(inquiryId);

    if (userId !== inquiry.userId) {
        throw new Error("NOT_YOUR_INQUIRY");
    }

    if (inquiry.answer) {
        throw new Error("ALREADY_ANSWERED_INQUIRY");
    }
    return inquiry;
};

const updateInquiry = async (inquiryId: number, userId: number, title: string, content: string) => {
    await validateInquiryEditable(inquiryId, userId);

    return prisma.inquiry.update({
        where: {
            id: inquiryId,
        },
        data: {
            title,
            content,
        }
    })
}

const deleteInquiry = async (inquiryId: number, userId: number) => {
    await validateInquiryEditable(inquiryId, userId);

    return prisma.inquiry.delete({
        where: {
            id: inquiryId,
        }
    })
};

export default { getInquiryList, getInquiryByID, answerInquiry, createInquiry, updateInquiry, deleteInquiry };
// dd
