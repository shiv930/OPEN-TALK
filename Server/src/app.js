import http from "http";
import express from "express";
import cookieparser from "cookie-parser";
import corsMiddleware, { corsOptions } from "./config/cors.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userRoutes from "./routes/user.route.js";
import serverRouter from "./routes/server.routes.js";
import serverMemberRoutes from "./routes/serverMember.routes.js";
import roleRouter from "./routes/role.route.js";
import channelRouter from "./routes/channel.route.js";
import { initSocket } from "./services/socket.services.js";
import messageRouter from "./routes/message.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import paymentRoutes from "../src/routes/payment.routes.js";

const app = express(); // app ko Express instance ke liye use kar

app.set("trust proxy", 1);
app.use(corsMiddleware);
const server = http.createServer(app); //  HTTP server (server) → tumhare app ko run karta hai aur socket.io ke liye base provide karta hai.
initSocket(server, corsOptions);

app.use(passport.initialize());
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (_, __, profile, done) => {
      return done(null, profile);
    },
  ),
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/server", serverRouter);
app.use("/api/serverMember", serverMemberRoutes);
app.use("/api/role", roleRouter);
app.use("/api/channel", channelRouter);
app.use("/api/message", messageRouter);
app.use("/api/payments", paymentRoutes);

app.use(errorMiddleware);

export default server;
