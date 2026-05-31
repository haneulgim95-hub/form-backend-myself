import prisma from "../config/prisma.ts";

const getActiveCategories = async ()=>{
    return prisma.category.findMany({
        orderBy: {
            id: "desc"
        },
        where: {
            status: "ACTIVE",
        },
        select: {
            id: true,
            name: true,
        }
    })
};

export default {getActiveCategories};