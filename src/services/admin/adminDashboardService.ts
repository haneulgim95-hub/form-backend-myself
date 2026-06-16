import prisma from "../../config/prisma.ts";

const getDashboardSummary = async () => {
    const [users, posts, inquiries] = await Promise.all([
        prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
        prisma.post.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma.inquiry.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                    },
                },
            },
        }),
    ]);

    return {
        users,
        posts,
        inquiries,
    }
};

export default { getDashboardSummary };
