import prisma from "../../config/prisma.ts";

const getCategoryList = async () => {
    return prisma.category.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

export default { getCategoryList };