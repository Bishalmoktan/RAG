import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import express, { Express, Request, Response } from "express";

import config from "./config/index.js";
import { rootRouter } from "./routes/root.route.js";
import { swaggerUi, swaggerSpec } from "./utils/swagger.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

dotenv.config();

const app: Express = express();

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);
app.use(
  cors({
    ...config.cors,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health-check", (req: Request, res: Response) => {
  res.json({ message: "The server is running!" });
});

app.use("/api/v1", rootRouter);

app.use(globalErrorHandler);

export { app };
