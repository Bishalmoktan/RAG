import path from "path";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../utils/apiError.js";
import { errorResponse } from "../utils/errorMessage.js";
import * as uploadService from "../services/upload.service.js";
import { apiResponse } from "../utils/apiResponse.js";

export async function handleUpload(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        errorResponse.VALIDATION.MISSING
      );
    }
    const filePath = path.resolve("uploads", file.originalname);

    await uploadService.handleUpload(
      file.originalname,
      filePath,
      file.mimetype
    );

    apiResponse(res, StatusCodes.CREATED, {
      message: "Uploaded and processed",
    });
  } catch (error) {
    throw error;
  }
}
