// 인쿼리는 백엔드에서 시딩해야 하는 이유
// 한사람만 문의를 잔뜩 남기는건 어색하다
// 여러사람이 랜덤으로 (남길수도 있고, 안남길수도 있고)
// 랜덤한 수만큼 문의를 남기는게 자연스럽다.

// 문의글 등록시 필요한것 : 유저아이디, (타이틀, 컨텐트)
import prisma from "../src/config/prisma.ts";
import inquiryService from "../src/services/inquiryService.ts";

const mockInquiryList = [
    {
        title: "배송 일정 문의",
        content: "주문한 상품의 배송 예정일이 궁금합니다. 현재 배송 준비 중으로 표시되고 있습니다.",
    },
    {
        title: "환불 요청",
        content: "구매한 상품이 예상과 달라 환불을 요청하고 싶습니다. 환불 절차를 안내해 주세요.",
    },
    {
        title: "회원 정보 수정 문의",
        content: "전화번호를 변경하려고 하는데 수정 메뉴를 찾을 수 없습니다.",
    },
    {
        title: "게시글 삭제 요청",
        content: "실수로 작성한 게시글을 삭제하고 싶습니다. 삭제 방법을 알려주세요.",
    },
    {
        title: "비밀번호 재설정 문의",
        content: "비밀번호를 잊어버렸습니다. 재설정 링크가 오지 않는데 확인 부탁드립니다.",
    },
    { title: "이벤트 참여 확인", content: "이벤트에 정상적으로 참여되었는지 확인하고 싶습니다." },
    {
        title: "신고 기능 관련 문의",
        content: "부적절한 게시글을 신고했는데 처리 결과는 어디서 확인할 수 있나요?",
    },
    {
        title: "계정 탈퇴 문의",
        content: "계정 탈퇴 시 작성한 게시글과 댓글도 함께 삭제되는지 궁금합니다.",
    },
    { title: "알림 설정 문의", content: "댓글 알림을 받고 싶지 않은데 설정 방법을 알려주세요." },
    {
        title: "첨부파일 업로드 오류",
        content: "이미지 파일을 업로드하려고 하면 오류가 발생합니다. 해결 방법이 있을까요?",
    },
    {
        title: "서비스 이용 제한 문의",
        content: "갑자기 글 작성이 되지 않습니다. 이용 제한 여부를 확인 부탁드립니다.",
    },
    { title: "닉네임 변경 요청", content: "현재 닉네임을 다른 이름으로 변경하고 싶습니다." },
    {
        title: "공지사항 관련 질문",
        content: "최근 공지사항에 안내된 점검 일정이 변경되었는지 궁금합니다.",
    },
    { title: "게시글 검색 오류", content: "검색어를 입력해도 결과가 표시되지 않습니다." },
    {
        title: "문의 답변 소요 시간",
        content: "문의를 등록했는데 보통 답변까지 얼마나 걸리는지 알고 싶습니다.",
    },
];

async function seedInquiries() {
    try {
        const users = await prisma.user.findMany({
            where: {
                deletedAt: null,
            },
        });
        if (users.length === 0) {
            console.log("문의글을 남길 사용자가 존재하지 않습니다.");
            return;
        }

        for (const user of users) {
            if (Math.random() > 0.3) {
                console.log(`[userId : {${user.id}}]은(는) 이번 시딩에 참여하지 않습니다. `);
                continue;
            }
            const randomCount = Math.floor(Math.random() * 5) + 3;

            for (let i = 0; i < randomCount; i++) {
                const targetMockElement =
                    mockInquiryList[Math.floor(Math.random() * mockInquiryList.length)];

                if (!targetMockElement) {
                    continue;
                }
                try {
                    await inquiryService.createInquiry(
                        user.id,
                        targetMockElement.title,
                        targetMockElement.content,
                    );
                    console.log(`[userId: ${user.id}] (${i + 1}/${randomCount}) 문의글 등록 성공`);
                } catch (error) {
                    console.log(`[userId: ${user.id}] (${i + 1}/${randomCount}) 문의글 등록 실패`);
                }
            }
        }
    } catch (error) {
        console.log("시딩 작업 중 오류가 발생되었습니다.", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedInquiries().then(() => {});
