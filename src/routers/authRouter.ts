import express from "express";
import { register } from "../controllers/authController";

const authRouter = express();

authRouter.route("/register").post(register);

export default authRouter;
