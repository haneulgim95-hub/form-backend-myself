import prisma from "../config/prisma.ts";

const createReply = async (userId: number, postId: number, content: string) => {
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        }
    })
    if (!post) {
        throw new Error("NOT_FOUND");
    }

    return prisma.reply.create({
        data: {
            content,
            postId,
            userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                    email: true,
                }
            }
        }
    });
};

export default { createReply};