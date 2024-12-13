import ConversationService from "../services/conversation.service.js";
import MessageService from "../services/message.service.js";
import { Server } from "socket.io";
import UserService from "../services/user.service.js";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { logger } from "../config/winston.js";
import { broadcast } from "./broadcast.js";
import notificationJob from "../jobs/notification.job.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://h5.zdn.vn",
  "zbrowser://h5.zdn.vn",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://h5.zdn.vn:3000",
  "http://173.249.195.64:5173",
  "https://trovn.io.vn",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    // credentials: true,
  },
});
const onlineUser = new Set();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    try {
      const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  const user = socket.user;
  if (!user) {
    logger.error(new Error("User not found"));
    return;
  }

  socket.join(user.id.toString());
  onlineUser.add(user.id.toString());

  if (!user) {
    logger.error(new Error("User not found"));
    return;
  }

  broadcast(io, socket);
  notificationJob(io);

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("messagePage", async (conversationId) => {
    try {
      const conversation = await ConversationService.getConversationById(
        conversationId
      );

      const receiverUser =
        conversation?.receiver?.id === user?.id
          ? conversation?.sender
          : conversation?.receiver;

      const payload = {
        id: receiverUser?.id,
        username: receiverUser?.username,
        email: receiverUser?.email,
        fullName: receiverUser?.fullName,
        role: receiverUser?.role,
        avatarUrl: receiverUser?.avatarUrl,
        online: onlineUser.has(receiverUser?.id),
      };

      socket.emit("messageUser", payload);

      const conversationMessages =
        await ConversationService.getConversationMessageById(conversationId);

      socket.emit("message", {
        conversationId,
        messages: conversationMessages?.messages || [],
      });
    } catch (error) {
      logger.error("Error in messagePage event:", error);
      socket.emit("error", "An error occurred while fetching messages");
    }
  });

  socket.on("newMessage", async (data) => {
    try {
      if (!data) {
        return;
      }

      if (data.sender === data.receiver) {
        return;
      }

      let conversation = await ConversationService.getConversation(
        data.sender,
        data.receiver,
        data.listingId
      );

      if (!conversation) {
        conversation = await ConversationService.createConversation(
          data.sender,
          data.receiver,
          data.listingId
        );
      }

      const message = await MessageService.createMessage(
        data?.text,
        data?.userId,
        conversation?.id
      );

      const getConversationMessage =
        await ConversationService.getConversationMessage(
          data?.sender,
          data?.receiver,
          data?.listingId
        );

      io.to(data?.sender).emit("message", {
        conversationId: conversation.id,
        messages: getConversationMessage?.messages || [],
      });

      io.to(data?.receiver).emit("message", {
        conversationId: conversation.id,
        messages: getConversationMessage?.messages || [],
      });

      io.to(data?.receiver).emit("newMessageNotification", {
        sender: data?.sender,
        text: data?.text,
        senderName: data?.senderName,
      });

      const conversationSender = await ConversationService.getConversations(
        data?.sender
      );
      const conversationReceiver = await ConversationService.getConversations(
        data?.receiver
      );

      io.to(data?.sender).emit("conversation", conversationSender);
      io.to(data?.receiver).emit("conversation", conversationReceiver);
    } catch (error) {
      logger.error("Error in newMessage event:", error);
      socket.emit("error", "An error occurred while sending the message");
    }
  });

  socket.on("sidebar", async (currentUserId) => {
    const conversation = await ConversationService.getConversations(
      currentUserId
    );
    socket.emit("conversation", conversation);
  });

  socket.on("deleteConversation", async (conversationId, currentUserId) => {
    try {
      if (!conversationId) {
        logger.error("Conversation ID is missing");
        socket.emit("error", "Conversation ID is required");
        return;
      }

      const deleteResult = await ConversationService.deleteConversation(
        conversationId
      );

      if (!deleteResult) {
        throw new Error("Failed to delete the conversation");
      }

      const conversations = await ConversationService.getConversations(
        currentUserId
      );

      socket.emit("conversation", conversations);
    } catch (error) {
      logger.error("Error in deleteConversation event:", error);
      // socket.emit("error", "An error occurred while deleting the conversation");
    }
  });

  socket.on("seen", async (userId) => {
    try {
      if (!user || !userId) {
        logger.error("User or userId is missing");
        return;
      }

      const conversation = await ConversationService.getConversationMessage(
        user.id,
        userId
      );
      const conversationMessageId =
        conversation?.messages?.map((item) => item.id) || [];

      if (conversationMessageId.length > 0) {
        await MessageService.updateMessage(conversationMessageId, userId, {
          isSeen: true,
        });

        const conversationSender = await ConversationService.getConversations(
          user.id
        );
        const conversationReceiver = await ConversationService.getConversations(
          userId
        );

        io.to(user.id).emit("conversation", conversationSender);
        io.to(userId).emit("conversation", conversationReceiver);
      }
    } catch (error) {
      logger.error("Error in seen event:", error);
    }
  });

  socket.on("unreadMessagesCount", async (userId) => {
    try {
      if (!userId) {
        logger.error("userId is missing");
        return;
      }
      const unreadCount = await MessageService.getMessageNotSeen(userId);
      socket.emit("unreadMessagesCount", unreadCount);
    } catch (error) {
      logger.error("Error in checkUnreadMessages event:", error);
    }
  });

  socket.on("typing", (conversationId) => {
    socket.to(conversationId).emit("typing");
  });

  socket.on("stopTyping", (conversationId) => {
    socket.to(conversationId).emit("stopTyping");
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?.id);
    io.emit("onlineUser", Array.from(onlineUser));
  });
});

export { app, server };
