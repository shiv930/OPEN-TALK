import dotenv from "dotenv";
import { Redis } from "ioredis";

dotenv.config();

const redisUrl = process.env.REDIS_URL?.trim();
const redisHost = process.env.REDIS_HOST?.trim();
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisTls = /^(true|1)$/i.test(process.env.REDIS_TLS || "");

if (!redisUrl && !redisHost) {
  throw new Error("Redis configuration missing: set REDIS_URL or REDIS_HOST");
}

if (!redisUrl && (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535)) {
  throw new Error("Invalid REDIS_PORT: expected a port between 1 and 65535");
}

const connectionOptions = {
  connectTimeout: 10000,
  maxRetriesPerRequest: 3,
  retryStrategy: (attempt) => Math.min(attempt * 1000, 10000),
};

const redis = redisUrl
  ? new Redis(redisUrl, connectionOptions)
  : new Redis({
      ...connectionOptions,
      host: redisHost,
      port: redisPort,
      username: process.env.REDIS_USERNAME || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
      ...(redisTls ? { tls: { servername: redisHost } } : {}),
    });

redis.on("connect", () => {
  console.log("Redis connection established");
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export default redis;