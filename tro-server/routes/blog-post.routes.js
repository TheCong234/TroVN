import BlogPostController from "../controllers/blog-post.controller.js";
import express from "express";
import { verifyTokenWithAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/blog-posts", verifyTokenWithAdmin, BlogPostController.create);
router.get("/blog-posts", BlogPostController.findAll);
router.get("/blog-posts/:slug", BlogPostController.findOne);
// router.put("/blog-posts/:id", verifyTokenWithAdmin, BlogPostController.update);
router.delete(
  "/blog-posts/:id",
  verifyTokenWithAdmin,
  BlogPostController.delete
);

export default router;
