import replyService from "../src/services/replyService.ts";
import prisma from "../src/config/prisma.ts";

const mockReplyList = [
    "이건 솔직히 논란의 여지가 없다 ㅋㅋㅋ 무조건 1번이지",
    "2번 고른 사람들은 진짜 맛알못인가... 진지하게 이해가 안 가네",
    "진지하게 과학적 근거를 대자면 1번이 맞음. 반박 시 내 말이 다 맞음",
    "아니 2번이 진리인데 왜 표가 이거밖에 안 나옴? 집단 지성 다 죽었나?",
    "중립 기어 박으려다가 1번 진영 논리보고 감탄해서 바로 1번 찍고 갑니다.",
    "와 실시간으로 투표 결과 박빙인거 봐라 ㅋㅋㅋ 점점 웅장해진다",
    "오늘도 평화로운 대난투 전장... 난 외롭게 2번에 한 표 던진다",
    "1번 고른 형들 나중에 나랑 키보드로 한판 더 뜨자",
    "이건 가치관의 차이라 정답이 없다만, 어쨋든 내 선택은 2번임",
    "와.. 댓글 창 보러 들어왔는데 예상대로 혼돈의 카오스네 ㅋㅋㅋ",
    "다들 진정해... 어차피 내일 출근해야 되잖아",
    "이 토론 올린 사람 칭찬해. 간만에 도파민 터지는 주제네.",
];

async function seedReplies() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                deletedAt: null,
            },
        });

        if (posts.length === 0) {
            throw new Error("댓글을 등록할 게시글이 존재하지 않습니다.");
        }

        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
        });

        if (users.length === 0) {
            throw new Error("댓글을 작성할 사용자가 존재하지 않습니다.");
        }

        const randomCount = Math.floor(Math.random() * 10) + 3;

        for (const post of posts) {
            for (let i = 0; i < randomCount; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const content = mockReplyList[Math.floor(Math.random() * mockReplyList.length)];
                if (!user) {
                    continue;
                }

                if (!content) {
                    continue;
                }
                try {
                    // await replyService.createReply(user.id, post.id, content);
                    await prisma.reply.create({
                        data: {
                            content,
                            user: { connect: { id: user.id } },
                            post: { connect: { id: post.id } },
                        },
                    });

                    console.log(
                        `[${i + 1}/${randomCount}] (postId: ${post.id}, userId: ${user.id}) 댓글 등록 성공`,
                    );
                } catch (error) {
                    console.log(
                        `[${i + 1}/${randomCount}] (postId: ${post.id}, userId: ${user.id}) 댓글 등록 실패`,
                    );
                }
            }
        }
        console.log("-----시딩작업종료------------");
    } catch (error) {
        console.log("시딩 작업 실패: ", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedReplies().then(() => {});
