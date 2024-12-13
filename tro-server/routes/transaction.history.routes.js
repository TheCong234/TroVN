import express from "express";
import TransactionHistoryController from "../controllers/transaction.history.controller.js";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/transaction-history",
  verifyTokenAllRole,
  TransactionHistoryController.create
);

router.get(
  "/transaction-history/user",
  verifyTokenAllRole,
  TransactionHistoryController.findByUser
);

export default router;
