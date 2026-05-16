import dotenv from "dotenv";
import express from "express";
import * as process from "node:process";
import * as console from "node:console";
import userRouter from "./routes/userRouter.ts";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log(`서버가 실행되었습니다 http://localhost:${PORT}`);
})