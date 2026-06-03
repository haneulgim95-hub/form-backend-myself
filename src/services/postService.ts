import prisma from "../config/prisma.ts";
import { PostCreateInput } from "../generated/prisma/models/Post.ts";

const getPostsByCategory = async (categoryId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const take = size;

    // SELECT COUNT(*) FROM post WHERE categoryId = categoryId AND deletedAt = NULL
    const total = await prisma.post.count({
        where: {
            categoryId,
            deletedAt: null,
        },
    });

    // SELECT * FROM post WHERE categoryId = categoryId AND deletedAt = null ORDER BY id DESC
    const list = await prisma.post.findMany({
        where: {
            categoryId,
            deletedAt: null,
        },
        orderBy: {
            id: "desc", // 글목록은 최신글부터 보여준다.
        },
        skip,
        take,
        include: {
            // user: true,      => 연관된 user 테이블의 정보를 싹 긁어옴(비밀번호도 들어감)
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

const getPostById = async (postId: number, userId?: number) => {
    // SELECT를 했는데 자료가 검색이 안되면, 어차피 post라는 변수엔 null임
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
                },
            },
        },
    });

    if (!post) {
        // 이 아래쪽으로는 진행을 못 하도록 막기 위해, return울 처줌
        return null;
    }

    // 이 글의 투표에 대한 내용을 불러와야 함
    // 왜? 그럼 post에서 검색해올 떄 votes를 쓰면 되지 않나? 라고 할 수 있는데
    // 이렇게 votes에 vote 테이블에 있는 정보를 덧붙이면(JOIN하면)
    // 누가, 몇 번에, 투표했는지 정보가 다 노출됨
    // 우리가 필요한건 1번에 몇 명, 2 번에 몇 명 투표했는지만 필요하지
    // 누가 몇 번에 투표했는가에 대한 정보는 필요 없음

    const option1Count = await prisma.vote.count({
        where: {
            postId: postId,
            option: 1,
        },
    });

    const option2Count = await prisma.vote.count({
        where: {
            postId: postId,
            option: 2,
        },
    });

    // 지금 요청을 한 이 사람이 이 글에 대해 투표를 했는지 안 했는지
    let hasVoted = false;
    if (userId) {
        // findFirst는 조건에 맞는 첫 번쨰 데이터만 찾음
        const myVote = await prisma.vote.findFirst({
            where: {
                userId: userId,
                postId: postId,
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

const createPost = async (postData: PostCreateInput) => {
    // INSERT 쿼리를 전송
    return prisma.post.create({
        data: postData,
    });
};

const votePost = async (userId: number, postId: number, option: number) => {
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        }
    });
    if (!post) {
        throw new Error("NOT FOUND");
    }

    if (!post.option1Text || !post.option2Text) {
        throw new Error("NOT_VOTABLE");
    }

    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId, postId
            }
        }
    })
    if(existingVote) {
        throw new Error("ALREADY_VOTED");
    }

    return prisma.vote.create({
        data: {
            userId,
            postId,
            option
        }
    })
};

const cancelVotePost = async (userId: number, postId: number) => {
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId, postId
            }
        }
    })
    if(!existingVote) {
        throw new Error("NOT_VOTED");
    }

    await prisma.vote.delete({
        where: {
            userId_postId: {
                userId, postId
            }
        }
    })

    return;
};


export default { getPostsByCategory, createPost, getPostById, votePost, cancelVotePost };
