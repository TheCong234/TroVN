import express from "express";
import WithdrawalRequestController from "../controllers/withdrawal.request.controller.js";
import {
  verifyTokenAllRole,
  verifyTokenWithAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/withdrawal-requests",
  verifyTokenAllRole,
  WithdrawalRequestController.create
);

router.get(
  "/withdrawal-requests/user",
  verifyTokenAllRole,
  WithdrawalRequestController.findByUserId
);
router.get(
  "/withdrawal-requests",
  verifyTokenWithAdmin,
  WithdrawalRequestController.findAll
);
router.delete(
  "/withdrawal-requests/:id",
  verifyTokenAllRole,
  WithdrawalRequestController.delete
);
router.put(
  "/withdrawal-requests/:id",
  verifyTokenAllRole,
  WithdrawalRequestController.update
);

export default router;
