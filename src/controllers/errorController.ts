import AppError from "../util/appError";
import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";

enum ErrorTypes {
  validationError = "ValidationError",
  mongoServerError = "MongoServerError",
}

const sendErrorInDevelopmentMode = (
  err: AppError,
  req: Request,
  res: Response
) => {
  const statusCode = err.statusCode;
  return res.status(statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timeStamp: new Date(),
  });
};

const sendErrorInProductionMode = (
  err: AppError,
  req: Request,
  res: Response
) => {
  const statusCode = err.statusCode;
  if (err.isOperational) {
    console.log("production error : isOperational ");
    // console.log(err);
    return res.status(statusCode).json({
      status: err.status,
      message: err.message,
      timeStamp: new Date(),
    });
  }

  console.log("production error : notOperational");
  //   console.log(err);
  return res.status(500).json({
    status: "error",
    message: `Looks like Something went wrong, Please don't hate us  `,
  });
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inDevelopmentMode = process.env.NODE_ENV === "development";
  const inProductionMode = process.env.NODE_ENV === "production";

  if (inDevelopmentMode) {
    console.log("receieved error obj in development --> ", err);
    sendErrorInDevelopmentMode(err, req, res);
  }

  if (inProductionMode) {
    console.log("receieved error obj in production --> ", err);
    let errorObj: AppError = err;
    if (err.name === ErrorTypes.validationError) {
      const validationError = err as unknown as Error.ValidationError;
      errorObj = handleValidationError(validationError);
    }
    if (err.name === ErrorTypes.mongoServerError) {
      errorObj = handleDuplicateFieldValueError(err);
    }

    sendErrorInProductionMode(errorObj, req, res);
  }
};

const handleValidationError = (err: Error.ValidationError): AppError => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data. ${error.join(". ")}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldValueError = (err: AppError): AppError => {
  const genericError = err as any;
  console.log("err --> ", genericError.keyValue);
  const value = genericError.keyValue as { [key: string]: string };
  const message = `Duplicate field value:${value}. Please use another value`;
  return new AppError(message, 400);
};

export default globalErrorHandler;
