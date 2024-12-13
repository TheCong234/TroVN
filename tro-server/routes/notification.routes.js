import express from "express";

import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";
import NotificationController from "../controllers/notification.controller.js";

const router = express.Router();

router.post(
  "/notifications",
  verifyTokenAllRole,
  NotificationController.create
);

router.get(
  "/notifications/user",
  verifyTokenAllRole,
  NotificationController.findAllByUser
);

router.get(
  "/notifications/unread/user",
  verifyTokenAllRole,
  NotificationController.getCountNotificationUnRead
);

router.put(
  "/notifications/:id",
  verifyTokenAllRole,
  NotificationController.update
);

router.delete(
  "/notifications/:id",
  verifyTokenAllRole,
  NotificationController.delete
);

export default router;
