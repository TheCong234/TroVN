import SearchHistoryController from "../controllers/search-history.controller.js";
import express from "express";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/search-histories",
  verifyTokenAllRole,
  SearchHistoryController.findAll
);
router.delete(
  "/search-histories/user",
  verifyTokenAllRole,
  SearchHistoryController.deleteMany
);
router.delete(
  "/search-histories/:id",
  verifyTokenAllRole,
  SearchHistoryController.delete
);

export default router;
