import prisma from "../config/prisma.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";

const getPostsByCategory = async (categoryId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const take = size;
    const total = await prisma.post.count({
        where: {
            categoryId,
            deletedAt: null,
        }
    })

    const list = await prisma.post.findMany({
        where: {
            categoryId,
            deletedAt: null,
        },
        orderBy: {
          id: "desc"
        },
        skip,
        take,
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

    return {
        page,
        size,
        total,
        list,
    }
};

const getPostById = async (postId: number, userId?: number) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
            deletedAt: null,
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
    })

    if (!post) {
        return null;
    }

    const option1Count = await prisma.vote.count({
        where: {
            id: postId,
            option: 1
        }
    });

    const option2Count = await prisma.vote.count({
        where: {
            id: postId,
            option: 2
        }
    })

    let hasVote = false;

    if (userId) {
        const myVote = await prisma.vote.findFirst({
            where: {
                userId,
                postId,
            }
        });
        if (myVote) {
            hasVote = true;
        }
    }

    return {
        ...post,
        vote: {
            option1Count,
            option2Count,
            totalCount: option1Count + option2Count,
            hasVote,
        }
    }

};

const createPost = async (input: PostCreateInput) => {
    return prisma.post.create({
        data: input,
    });
};

export default { getPostsByCategory, createPost, getPostById };