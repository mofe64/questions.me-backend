import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { IRegistrationRequest } from "./authController.interface";

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
  } catch (e: any) {
    console.log(e);
  }
};
