import multer from "multer";
import { ZodError } from "zod";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { logger } from "../logging/logger.js";
import { ApiError } from "../utils/apiError.js";

export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let issues: { path: string; message: string }[] | null = null;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    issues = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle custom ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message || "Something went wrong";
  }

  // Handle multer errors
  else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = `Multer Error: ${err.message}`;
  }

  // Handle general Error (including custom errors from multer fileFilter)
  else if (err instanceof Error) {
    statusCode = 400;
    message = err.message;
  }

  // Log the error
  logger.error({
    message: err instanceof Error ? err.message : "Unknown error",
    path: req.originalUrl,
    method: req.method,
    stack: err instanceof Error ? err.stack : null,
  });

  // Return the response
  res.status(statusCode).json({
    success: false,
    message,
    ...(issues ? { issues } : {}),
  });
};
