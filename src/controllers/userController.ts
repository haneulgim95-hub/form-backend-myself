import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import userService from "../services/userService.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";
import { LoginInputType } from "../schemas/user/loginUser.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { UpdateUserInputType } from "../schemas/user/updateUserSchema.ts";

const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, name, nickname, email, phoneNumber, birthdate, gender, role } =
            req.body;

        const userData: UserCreateInput = {
            username,
            password: await passwordUtil.hashPassword(password),
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
        if (error instanceof Error) {
            switch(error.message) {
                case "ALREADY_EXISTS_USERNAME":
                    res.status(409).json({ message: "이미 사용 중인 아이디입니다"});
                    return;
                case "ALREADY_EXISTS_EMAIL":
                    res.status(409).json({ message: "이미 가입된 이메일입니다."});
                    return;
                case "ALREADY_EXISTS_NICKNAME":
                    res.status(409).json({ message: "이미 사용 중인 닉네임입니다."});
                    return;
                default:
                    res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다."});
                    return;
            }
        }

        console.log(error);
        res.status(500).json({message: "유저 생성 중 오류가 발생했습니다."});
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const loginData: LoginInputType = req.body;
        const result = await userService.login(loginData);

        res.status(200).json({ message: "로그인에 성공하였습니다.", data: result });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "INVALID_CREDENTIALS") {
                res.status(401).json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
                return;
            }
        }

        // 에러 메세지가 INVALID_CREDENTIALS가 아닌 그 외의 모든것들...
        console.log(error);
        res.status(500).json({ message: "로그인 처리 중 서버 에러가 발생했습니다." });
    }
};

const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다."});
            return;
        }
        const userId = req.user.id;

        const input: UpdateUserInputType = req.body;

        const result = await userService.updateUser(userId, input);
        res.status(200).json({ message: "사용자 정보를 성공적으로 수정했습니다.", data: result });
    } catch (error) {

    }
};

export default {
    createUser,
    login,
    updateUser,
};
