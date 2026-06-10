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

export default { getInquiryList };
