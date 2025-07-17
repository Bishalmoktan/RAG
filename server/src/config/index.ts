import { CorsOptions } from "cors";
import { env } from "./env.js";

const isProduction = env.NODE_ENV === "production";

export default {
  app: {
    isProduction,
    port: env.PORT || 8080,
  },
  cors: {
    origin: ["http://localhost:8080", "http://127.0.0.1:8080"],
  } as CorsOptions,
  database: {
    postgres: {
      url: env.DATABASE_URL,
    },
  },
  service: {
    ocr: {
      url: env.OCR_SERVICE_URL,
    },
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  },
} as const;
