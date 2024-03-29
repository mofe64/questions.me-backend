import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routers/authRouter";
import globalErrorHandler from "./controllers/errorController";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ limit: "10kb", extended: false }));

app.use("/api/v1/auth", authRouter);
app.use(globalErrorHandler);

export default app;
