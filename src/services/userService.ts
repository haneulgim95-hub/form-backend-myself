import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return prisma.user.create({
            data,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default {
    createUser,
};
