import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// 암호화하는 함수
const hashPassword = async (password: string) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

// 검증하는 함수
const verifyPassword = async (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

export default {
    hashPassword,
    verifyPassword
};