import express from "express";
import zaloWebhook from "../webhook/zalo.webhook.js";

const router = express.Router();

router.post("/zalo/webhook", zaloWebhook.revokeConsent);

export default router;
