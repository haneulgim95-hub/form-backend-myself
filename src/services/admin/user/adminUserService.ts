import prisma from "../../../config/prisma.ts";
import { UserCreateInput, UserUpdateInput } from "../../../generated/prisma/models/User.ts";
import { Prisma } from "../../../generated/prisma/client.ts";

const getUserList = async () => {
    return prisma.user.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!id) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};

const createUser = async (input: UserCreateInput) => {
    try {
        return prisma.user.create({
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const errorMessage = error.message;
                if (errorMessage.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
            }
        }
        throw new Error("UNKNOWN_ERROR");
    }
};

const updateUser = async (id: number, input: UserUpdateInput) => {
    try {
        return await prisma.user.update({
            where: {
                id,
            },
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const errorMessage = error.message;
                if (errorMessage.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
            } else if (error.code === "P2025") {
                throw new Error("USER_NOT_FOUND");
            }
        }
        throw new Error("UNKNOWN_ERROR");
    }
};

const toggleUser = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    if (user.deletedAt) {
        throw new Error("ALREADY_EXISTS_DELETED");
    }

    return prisma.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
};

export default { getUserList, getUserById, createUser, updateUser, toggleUser };
