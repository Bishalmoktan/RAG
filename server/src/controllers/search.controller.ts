import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { errorResponse } from "../utils/errorMessage.js";
import * as searchService from "../services/search.service.js";

export async function handleSearch(req: Request, res: Response) {
  try {
    const query = req.query.q as string;
    if (!query) {
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        errorResponse.VALIDATION.MISSING_QUERY
      );
    }

    const data = await searchService.handleSearch(query);
    apiResponse(res, StatusCodes.OK, { data });
  } catch (error) {
    throw error;
  }
}
