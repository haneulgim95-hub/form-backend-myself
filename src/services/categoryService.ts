import prisma from "../config/prisma.ts";

const getActiveCategories = async () => {
    return prisma.category.findMany({
        where: {
            status: "ACTIVE",
        },
        orderBy: {
            id: "desc",
        },
        select: {
            id: true,
            name: true,
        }
    });
};

export default {getActiveCategories};