import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import {
  IRegistrationRequest,
  ILoginRequest,
} from "./authController.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const registrationRequest: IRegistrationRequest = req.body;

    const newUser = await User.create({
      email: registrationRequest.email,
      password: registrationRequest.password,
      username: registrationRequest.username,
      firstname: registrationRequest.firstname,
      lastname: registrationRequest.lastname,
    });

    res.status(201).json({
      success: true,
      timeStamp: new Date(),
      user: newUser,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginRequest: ILoginRequest = req.body;

    if (!loginRequest.username || !loginRequest.password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ username: loginRequest.username });

    if (!user) {
      return next(new AppError("No user found with that username", 400));
    }

    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!passwordMatch) {
      return next(new AppError("Incorrect password provided", 401));
    }

    const token = signToken(user._id.toString());
    res.status(200).json({
      success: true,
      timeStamp: new Date(),
      token,
    });
  }
);

const signToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
