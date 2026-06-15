import dotenv from "dotenv";
import express from "express";
import * as process from "node:process";
import * as console from "node:console";
import userRouter from "./routes/userRouter.ts";
import cors from "cors";
import adminRouter from "./routes/admin/adminRouter.ts";
import categoryRouter from "./routes/categoryRouter.ts";
import postRouter from "./routes/postRouter.ts";
import replyRouter from "./routes/replyRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/post", postRouter);
app.use("/reply", replyRouter);
app.use("/admin", adminRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);

app.listen(PORT, () => {
    console.log(`서버가 실행되었습니다 http://localhost:${PORT}`);
})