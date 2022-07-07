import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import {
  IRegistrationRequest,
  ILoginRequest,
} from "./authController.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      timeStamp: Date.now(),
      user: newUser,
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.log(error.message);
    res.status(400).json({
      success: false,
      timeStamp: Date.now(),
      message: error.message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginRequest: ILoginRequest = req.body;
    if (!loginRequest.username || !loginRequest.password) {
      throw new Error("Username and Password must be provided");
    }
    const user = await User.findOne({ username: loginRequest.username });
    if (!user) {
      throw new Error("No user found with that username");
    }
    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password
    );
    if (!passwordMatch) {
      throw new Error("Incorrect password provided");
    }
    const token = signToken(user._id.toString());
    res.status(200).json({
      success: true,
      timeStamp: Date.now(),
      token,
    });
  } catch (e: unknown) {
    const error = e as Error;
    console.log(error.message);
    res.status(400).json({
      success: false,
      timeStamp: Date.now(),
      message: error.message,
    });
  }
};

const signToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
