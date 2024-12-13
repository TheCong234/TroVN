import express from "express";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";
import InvoiceController from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/invoices", verifyTokenAllRole, InvoiceController.create);
router.put(
  "/invoices/:id",
  verifyTokenAllRole,
  InvoiceController.updateInvoice
);
router.delete(
  "/invoices/:id",
  verifyTokenAllRole,
  InvoiceController.deleteInvoice
);
router.delete(
  "/invoices/rented-room/:id",
  verifyTokenAllRole,
  InvoiceController.deleteByRentedRoomId
);
router.get(
  "/invoices/host",
  verifyTokenAllRole,
  InvoiceController.findByHostId
);
router.get(
  "/invoices/user",
  verifyTokenAllRole,
  InvoiceController.findAllByUserId
);

router.get("/invoices", verifyTokenAllRole, InvoiceController.findAll);
router.get("/invoices/:id", verifyTokenAllRole, InvoiceController.findById);

export default router;
