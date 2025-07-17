import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import * as uploadController from "../controllers/upload.controller.js";
import * as searchController from "../controllers/search.controller.js";

export const rootRouter = Router();

/**
 * @openapi
 * /api/v1/upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */

rootRouter.post(
  "/upload",
  upload.single("file"),
  uploadController.handleUpload
);

/**
 * @openapi
 * /api/v1/search:
 *   get:
 *     summary: Search something
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */

rootRouter.get("/search", searchController.handleSearch);
