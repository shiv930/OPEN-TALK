import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");
export const DEFAULT_CLIENT_URL = "https://open-talk-rose.vercel.app";

const allowedOrigins = new Set(
  [
    ...(process.env.CLIENT_URL || "").split(","),
    ...(process.env.FRONTEND_URL || "").split(","),
    DEFAULT_CLIENT_URL,
    "http://localhost:5173",
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};

export default cors(corsOptions);
export { corsOptions };
