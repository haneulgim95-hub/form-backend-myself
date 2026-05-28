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
    });

    const list = await prisma.post.findMany({
        where: {
            categoryId,
            deletedAt: null,
        },
        orderBy: {
            id: "desc",
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
    })

    return {
        page,
        size,
        total,
        list
    }
};

const createPost = async (input: PostCreateInput) => {
    return prisma.post.create({
        data: input,
    })
};

export default {getPostsByCategory, createPost };