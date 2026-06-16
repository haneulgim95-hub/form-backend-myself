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

const updatePassword = async (userId: number, prevPw: string, pw: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    // prevPw 사용자가 입력한 비밀번호는 평문
    // user.password는 암호문
    const isPasswordValid = await passwordUtil.verifyPassword(prevPw, user.password);
    if (!isPasswordValid) {
        throw new Error("INVALID_PASSWORD");
    }

    const hashedPassword = await passwordUtil.hashPassword(pw);

    // 지금 현재 비밀번호와 변경하려는 비밀번호가 같습니다
    // if (hashedPassword === user.password) {
    //     throw new Error("SAME_PASSWORD");
    // }

    // "5개월 전에 변경된 비밀번호입니다." 라는 에러로 튕겨내려면
    // 비밀번호 히스토리를 저장하고 있는 테이블을 따로 마련해야 함
    // 그 비밀번호 히스토리를 모두 findMany로 가져온 뒤
    // for문을 돌려서 비교, 그 후 시간과 함께 에러 리턴
    // 구글이 이 방식인데 이렇게 해도 문제가 되지 않는 이유는
    // 갖고 있는 비밀번호들이 전부 다 암호화 되어 있어서 구글도 실제 비밀번호가 뭔지는 모르기 때문

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });
};

export default {
    createUser,
    login,
    getUserById,
    updateUser,
    updatePassword,
};
