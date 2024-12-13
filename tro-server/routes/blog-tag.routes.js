import BlogTagController from "../controllers/blog-tag.controller.js";
import express from "express";
import {
  verifyTokenWithAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/blog-tags", verifyTokenWithAdmin, BlogTagController.create);

export default router;
