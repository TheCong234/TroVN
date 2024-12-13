import "./config/passport.config.js";

import {
  AdvertisingPackageRoutes,
  AmenityRoutes,
  AnalyticsRoutes,
  AppointmentRoutes,
  BannerRoutes,
  BlogPostRoutes,
  BlogTagRoutes,
  ConversationRoutes,
  FavoriteRoutes,
  GoogleAuthRoutes,
  ImageRoutes,
  ListingRoutes,
  ListingTagRoutes,
  LocationRoutes,
  OrderRoutes,
  PaymentRoutes,
  RentedRoomRoutes,
  ReportRoutes,
  ReviewRoutes,
  SearchHistoryRoutes,
  InvoiceRoutes,
  TagRoutes,
  UserRoutes,
  ZaloWebhookRoutes,
  NotificationRoutes,
  WithdrawalRequestRoutes,
  PaymentInfoRoutes,
  TransactionHistoryRoutes,
} from "./routes/index.js";
import { app, server } from "./socket/index.js";

import BannerModel from "./models/banner.model.js";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import cron from "node-cron";
import express from "express";
import { fileURLToPath } from "url";
import { logger } from "./config/winston.js";
import passport from "./config/passport.config.js";
import path from "path";
import rateLimit from "express-rate-limit";
import redisClient from "./config/redis.client.config.js";
import session from "express-session";
import errorHandler from "./middlewares/exception.middleware.js";
import { statusCode } from "./config/statusCode.js";
import { BaseResponse } from "./responses/BaseResponse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 8891;
const API_PREFIX = "/api/v1";

const allowedOrigins = [
  "https://h5.zdn.vn",
  "zbrowser://h5.zdn.vn",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://h5.zdn.vn:3000",
  "http://173.249.195.64:5173",
  "https://trovn.io.vn",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// TODO: server config
app.use(express.json({ limit: "30mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(compression());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(passport.initialize());
app.use(passport.session());

// const limiter = rateLimit({
//   skip: (req, res) => req.isLoggedIn,
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// });

// // Apply the rate limiting middleware to all requests.
// app.use(limiter);

// TODO: Routes
app.use(API_PREFIX, UserRoutes);
app.use(API_PREFIX, AmenityRoutes);
app.use(API_PREFIX, ListingRoutes);
app.use(API_PREFIX, LocationRoutes);
app.use(API_PREFIX, FavoriteRoutes);
app.use(API_PREFIX, BannerRoutes);
app.use(API_PREFIX, TagRoutes);
app.use(API_PREFIX, ListingTagRoutes);
app.use(API_PREFIX, AdvertisingPackageRoutes);
app.use(API_PREFIX, PaymentRoutes);
app.use(API_PREFIX, OrderRoutes);
app.use(API_PREFIX, ConversationRoutes);
app.use(API_PREFIX, AnalyticsRoutes);
app.use(API_PREFIX, GoogleAuthRoutes);
app.use(API_PREFIX, ReportRoutes);
app.use(API_PREFIX, ReviewRoutes);
app.use(API_PREFIX, ImageRoutes);

// v2RentedRoomRoutes
app.use(API_PREFIX, SearchHistoryRoutes);
app.use(API_PREFIX, BlogTagRoutes);
app.use(API_PREFIX, BlogPostRoutes);
app.use(API_PREFIX, AppointmentRoutes);
app.use(API_PREFIX, RentedRoomRoutes);
app.use(API_PREFIX, InvoiceRoutes);
app.use(API_PREFIX, NotificationRoutes);
app.use(API_PREFIX, WithdrawalRequestRoutes);
app.use(API_PREFIX, PaymentInfoRoutes);
app.use(API_PREFIX, TransactionHistoryRoutes);
// webhook
app.use(API_PREFIX, ZaloWebhookRoutes);

// TODO: relative path
app.use(express.static("./public"));

// TODO: run update banner 00h00
cron.schedule("0 0 * * *", async () => {
  try {
    logger.info(
      "Chạy công việc theo lịch trình để cập nhật các banner đã hết hạn."
    );
    await BannerModel.methods.updateExpiredBanners();
  } catch (error) {
    logger.error(error);
  }
});

// TODO: Redis

app.get("*", (req, res) => {
  res.status(404).send("DateTime" + Date.now());
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .json(BaseResponse.error("Có lỗi xảy ra", null));
});

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`server listen on http://localhost:${PORT}`);
});
