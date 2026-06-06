import prisma from "../src/config/prisma.ts";
import { User } from "../src/generated/prisma/client.ts";

async function seedVotes() {
    await prisma.vote.deleteMany();
    try {
        const posts = await prisma.post.findMany({
            where: {
                deletedAt: null,
            },
        });
        if (posts.length === 0) {
            throw new Error("투표를 진행할 게시글이 존재하지 않습니다. 시딩을 종료합니다.");
        }

        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
        });
        if (users.length === 0) {
            throw new Error("투표를 진행할 사용자가 존재하지 않습니다. 시딩을 종료합니다.");
        }

        for (const post of posts) {
            const randomCount = Math.min(Math.floor(Math.random() * 10) + 3, users.length);
            const selectedUsers: User[] = [];

            while (selectedUsers.length < randomCount) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                if (!randomUser) {
                    return;
                }

                if (!selectedUsers.includes(randomUser)) {
                    selectedUsers.push(randomUser);
                }
            }

            for (const selectedUser of selectedUsers) {
                const randomOption = Math.random() > 0.5 ? 1 : 2;
                try {
                    await prisma.vote.create({
                        data: {
                            option: randomOption,
                            post: { connect: { id: post.id } },
                            user: { connect: { id: selectedUser.id } },
                        },
                    });
                    console.log(`(userId: ${selectedUser.id}) (postId: ${post.id}) 투표 작업 성공`);
                } catch (error: any) {
                    console.log(`(userId: ${selectedUser.id}) (postId: ${post.id}) 투표 작업 실패`);
                    console.log("에러 코드:", error.code);
                    console.log("에러 메시지:", error.message);
                }
            }
        }
    } catch (error) {
        console.log("투표 시딩 작업 실패: ", error);
    }
}

seedVotes().then(() => {});
