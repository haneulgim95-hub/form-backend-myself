import prisma from "../config/prisma.ts";

const getNoticeList = async (page: number, size: number) => {
    const total = await prisma.notice.count();

    const list = await prisma.notice.findMany({
        orderBy: {
            id: "desc"
        },
        skip: (page - 1) * size,
        take: size,
    })

    return {
        total,
        page,
        size,
        list,
    }
};

const getNoticeById = async (noticeId: number) => {
    const notice = await prisma.notice.findUnique({
        where: {
            id: noticeId,
        },
    });
    if (!notice) {
        throw new Error("NOT_FOUND_NOTICE");
    }
    return notice;
};

const createNotice = async (title: string, content: string) => {
    return prisma.notice.create({
        data: {
            title,
            content,
        }
    })
};

const updateNotice = async (noticeId: number, title: string, content: string) => {
    await getNoticeById(noticeId);
    
    return prisma.notice.update({
        where: {
            id: noticeId
        },
        data: {
            title,
            content,
        }
    })
};

const deleteNotice = async (noticeId: number) => {
    await getNoticeById(noticeId);

    return prisma.notice.delete({
        where: {
            id: noticeId
        }
    })
};

export default {getNoticeList, getNoticeById, createNotice, updateNotice, deleteNotice};