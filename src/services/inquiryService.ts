import prisma from "../config/prisma.ts";

const getInquiryList = async (page: number, size: number, userId?: number) => {
    const whereCondition = userId ? { userId, deletedAt: null } : { deletedAt: null };

    const total = await prisma.inquiry.count({
        where: whereCondition,
    });

    const list = await prisma.inquiry.findMany({
        where: whereCondition,
        skip: (page - 1) * size,
        take: size,
        orderBy: {
            createdAt: "asc",
        },
        include: {
            answers: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            user: {
                select: {
                    id: true,
                    nickname: true,
                    email: true,
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


const getInquiryById = async (inquiryId: number) => {
    const inquiry = await prisma.inquiry.findFirst({
        where: {
            id: inquiryId,
            deletedAt: null,
        },
        include: {
            answers: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            user: {
                select: {
                    id: true,
                    nickname: true,
                    username: true,
                }
            }
        },
    });
    if (!inquiry) {
        throw new Error("INQUIRY_NOT_FOUND");
    }

    return inquiry;
};

const createInquiry = async (userId: number, title: string, content: string) => {
    return prisma.inquiry.create({
        data: {
            userId,
            title,
            content,
        },
    });
};

const updateInquiry = async (userId: number, inquiryId: number, title: string, content: string) => {
    const inquiry = await getInquiryById(inquiryId);

    if (inquiry.userId !== userId) {
        throw new Error("NOT_YOUR_INQUIRY");
    }

    if (inquiry.answers.length !== 0) {
        throw new Error("ALREADY_ANSWERED_INQUIRY");
    }
    return prisma.inquiry.update({
        where: {
            id: inquiryId,
        },
        data: {
            title,
            content,
        },
    });
};

const deleteInquiry = async (userId: number, inquiryId: number) => {
    const inquiry = await getInquiryById(inquiryId);

    if (inquiry.userId !== userId) {
        throw new Error("NOT_YOUR_INQUIRY");
    }

    if (inquiry.answers.length !== 0) {
        throw new Error("ALREADY_ANSWERED_INQUIRY");
    }

    return prisma.inquiry.update({
        where: {
            id: inquiryId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
};

export default {
    getInquiryList,
    getInquiryById,
    createInquiry,
    updateInquiry,
    deleteInquiry,
};
