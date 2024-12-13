import express from "express";
import PaymentInfoController from "../controllers/payment.info.controller.js";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/payment-info",
  verifyTokenAllRole,
  PaymentInfoController.getPaymentInfoByUserId
);
router.get(
  "/payment-info/:id",
  verifyTokenAllRole,
  PaymentInfoController.getPaymentInfoById
);

router.post("/payment-info", verifyTokenAllRole, PaymentInfoController.create);
router.put(
  "/payment-info/:id",
  verifyTokenAllRole,
  PaymentInfoController.update
);
router.delete(
  "/payment-info/:id",
  verifyTokenAllRole,
  PaymentInfoController.delete
);

export default router;
