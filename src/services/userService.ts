import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { LoginInputType } from "../schemas/user/loginUser.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";
import jwtUtil from "../utils/jwt/jwtUtil.ts";
import { UpdateUserInputType } from "../schemas/user/updateUserSchema.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const errorMessage = error.message;
                if (errorMessage.includes("username")) {
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickname")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN_ERROR");
            }
        }
        throw new Error("UNKNOWN_ERROR");
    }
};

const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
}

const login = async (data: LoginInputType) => {
        const user = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
        });

        if (!user || user.deletedAt) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const isValid = await passwordUtil.verifyPassword(data.password, user.password);

        if (!isValid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        // 로그인성공
        const token = jwtUtil.generateToken(user.id);

        const {password, deletedAt, ...safeUserInfo} = user;

        return {
            user: safeUserInfo,
            token
        }
};

const updateUser = async (userId: number, input: UpdateUserInputType) => {
    const existUser = await prisma.user.findFirst({
        where: {
            id: userId,
            deletedAt: null,
        }
    })
    if (!existUser) {
        throw new Error("USER_NOT_FOUND");
    }

    const existNickname = await prisma.user.findFirst({
        where: {
            nickname: input.nickname,
            deletedAt: null,
            id: {
                not: userId,
            }
        }
    })
    if (existNickname) {
        throw new Error("ALREADY_EXISTS_NICKNAME");
    }

    const existEmail = await prisma.user.findFirst({
        where: {
            email: input.email,
            deletedAt: null,
            id: {
                not: userId,
            }
        },
    });
    if (existEmail) {
        throw new Error("ALREADY_EXISTS_EMAIL");
    }

    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            nickname: input.nickname,
            email: input.email,
            phoneNumber: input.phoneNumber ?? null,
        }
    })
};

export default {
    createUser,
    login,
    getUserById,
    updateUser,
};
