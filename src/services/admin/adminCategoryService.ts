import prisma from "../../config/prisma.ts";
import { Request, Response } from "express";
import {
    CategoryCreateInput,
    CategoryUpdateInput,
} from "../../generated/prisma/models/Category.ts";
import { CategoryStatus, Prisma } from "../../generated/prisma/client.ts";

const getCategoryList = async () => {
    return prisma.category.findMany({
        orderBy: {
            id: "desc",
        },
    });
};

const getCategoryById = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }
    return category;
};

const createCategory = async (input: CategoryCreateInput) => {
    try {
        return await prisma.category.create({
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("ALREADY_EXISTS_CATEGORY_NAME");
            }
        }
        throw error;
    }
};

const updateCategory = async (id: number, input: CategoryUpdateInput) => {
    try {
        return await prisma.category.update({
            where: {
                id,
            },
            data: input,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("ALREADY_EXISTS_CATEGORY_NAME");
            }
            if (error.code === "P2025") {
                throw new Error("CATEGORY_NOT_FOUND");
            }
        }
        throw error;
    }
};

const toggleCategoryStatus = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });
    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }

    const newStatus =
        category.status === CategoryStatus.ACTIVE ? CategoryStatus.INACTIVE : CategoryStatus.ACTIVE;

    return prisma.category.update({
        where: {
            id,
        },
        data: {
            status: newStatus,
        },
    });
};

export default {
    getCategoryList,
    getCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
};
