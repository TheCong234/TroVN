import { Role } from "@prisma/client";
import UserService from "../services/user.service.js";
import NotificationService from "../services/notification.service.js";

export const broadcast = (io, socket) => {
  const handleBroadcastMessage = async (role, payload) => {
    const { type, message, title, data } = payload;
    const users = await UserService.getUserIdsByRole(role);
    console.log(users);

    await Promise.all(
      users.map(async (user) => {
        try {
          const notification = await NotificationService.create({
            userId: user.id,
            type,
            message,
            title,
            data,
          });
          io.to(user.id).emit("notification", {
            data: notification,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          io.to(user.id).emit("error", {
            data: error.message,
            timestamp: new Date().toISOString(),
          });
        }
      })
    );
  };

  socket.on("broadcastHostMessage", (payload) => {
    handleBroadcastMessage(Role.HOST, payload);
  });

  socket.on("broadcastUserMessage", (payload) => {
    handleBroadcastMessage(Role.USER, payload);
  });

  socket.on("broadcastMessage", async ({ type, message, title, data }) => {
    const users = await UserService.getAllUserIds();
    try {
      await Promise.all(
        users.map(async (user) => {
          try {
            const notification = await NotificationService.create({
              userId: user.id,
              type,
              message,
              title,
              data,
            });
            io.to(user.id).emit("notification", {
              data: notification,
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            io.to(user.id).emit("error", {
              data: error.message,
              timestamp: new Date().toISOString(),
            });
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendNotification", async (payload) => {
    const { userId, type, message, title, data } = payload;
    try {
      const notification = await NotificationService.create({
        userId,
        type,
        message,
        title,
        data,
      });
      io.to(userId).emit("notification", {
        data: notification,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      io.to(userId).emit("error", {
        data: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
};
