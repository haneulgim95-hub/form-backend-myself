import prisma from "../config/prisma.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";
import { VoteCreateInput } from "../generated/prisma/models/Vote.ts";

const getPostsByCategory = async (categoryId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const take = size;
    const total = await prisma.post.count({
        where: {
            categoryId,
            deletedAt: null,
        },
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

const getPostById = async (userId: number, postId: number) => {
    const post = await prisma.post.findFirst({
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
                },
            },
        },
    });

    if (!post) {
        throw new Error("POST_NOT_FOUND");
    }

    const option1Count = await prisma.vote.count({
        where: {
            id: postId,
            option: 1,
        },
    });

    const option2Count = await prisma.vote.count({
        where: {
            id: postId,
            option: 2,
        },
    });

    let hasVoted = false;
    if (userId) {
        const myVote = await prisma.vote.findUnique({
            where: {
                userId_postId: { userId, postId },
            },
        });

        if (myVote) {
            hasVoted = true;
        }
    }

    return {
        ...post,
        vote: {
            option1Count,
            option2Count,
            totalCount: option1Count + option2Count,
            hasVoted,
        },
    };
};

const createPost = async (data: PostCreateInput) => {
    return prisma.post.create({
        data,
    })
};

const votePost = async (userId: number, postId: number, option: number) => {
    // postId의 글이 존재하는지 유무
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        }
    })
    if (!post) {
        throw new Error("POST_NOT_FOUND");
    }
    // 투표할수 있는 글인지 확인
    if (!post.option1Text || !post.option2Text) {
        throw new Error("NOT_VOTABLE");
    }

    // 이 기능을 요청한 사람이 이 글의 투표를 했는지 유무. 했으면 에러를 던져줘야 한다.
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: { userId, postId },
        }
    })
    if (existingVote) {
        throw new Error("ALREADY_VOTED");
    }


    return prisma.vote.create({
        data: {
            option,
            userId,
            postId,
        }
    })
};

const cancelVotePost = async (postId: number, userId: number) => {
    const existVote = await prisma.vote.findUnique({
        where: {
            userId_postId: { userId, postId },
        }
    })
    if (!existVote) {
        throw new Error("NOT_FOUND");
    }

    await prisma.vote.delete({
        where: {
            userId_postId: { userId, postId },
        }
    })

    return;
};

export default { getPostsByCategory, getPostById, createPost, votePost, cancelVotePost };
