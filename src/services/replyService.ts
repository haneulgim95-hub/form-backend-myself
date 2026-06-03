import prisma from "../config/prisma.ts";

const getRepliesByPostId = async (postId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const total = await prisma.reply.count({
        where: {
            postId,
        }
    })

    const list = await prisma.reply.findMany({
        where: {
            postId,
        },
        orderBy: {
            id: "desc"
        },
        skip,
        take: size,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                }
            }
        }
    })

    return {
        page,
        size,
        total,
        list,
    }
};

const createReply = async (userId: number, postId: number, content: string) => {
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        }
    });
    if (!post) {
        throw new Error("NOT FOUND");
    }

    return prisma.reply.create({
        data: {
            content,
            userId,
            postId,
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
    })
};

export default {getRepliesByPostId, createReply};