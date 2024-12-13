import {
  verifyTokenAllRole,
  verifyTokenWithAdmin,
} from "../middlewares/auth.middleware.js";

import AppointmentController from "../controllers/appointment.controller.js";
import BlogPostController from "../controllers/blog-post.controller.js";
import express from "express";

const router = express.Router();

router.post("/appointments", verifyTokenAllRole, AppointmentController.create);
router.get("/appointments/host", verifyTokenAllRole, AppointmentController.findAllByHost);
router.get("/appointments", verifyTokenAllRole, AppointmentController.findAll);
router.put(
  "/appointments/:id",
  verifyTokenAllRole,
  AppointmentController.update
);
router.delete(
  "/appointments/:id",
  verifyTokenAllRole,
  AppointmentController.delete
);

export default router;
