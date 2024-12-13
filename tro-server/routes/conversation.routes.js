import ConversationController from "../controllers/conversation.controller.js";
import express from "express";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/conversation",
  verifyTokenAllRole,
  ConversationController.getConversation
);
router.put(
  "/conversation",
  verifyTokenAllRole,
  ConversationController.updateConversation
);

// router.delete(
//   "/conversation/:id",
//   verifyTokenAllRole,
//   ConversationController.delete
// );

export default router;
