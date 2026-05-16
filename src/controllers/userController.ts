import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import userService from "../services/userService.ts";

const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
            req.body;

        const userData: UserCreateInput = {
            username,
            password,
            name,
            nickname,
            email,
            phoneNumber,
            birthdate: birthdate? new Date(birthdate): null,
            gender,
            role,
        };

        const newUser = await userService.createUser(userData);

        // res.json() 이 이미 JSON.stringify() 를 대신 해주는 함수라는 점만 추가로 알면 된다.
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({message: "유저 생성 중 오류가 발생했습니다."});
    }
};

export default {
    createUser,
};
