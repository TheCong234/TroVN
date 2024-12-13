import NotificationModel from "../models/notification.model.js";
import { logger } from "../config/winston.js";

const NotificationService = {
  async create(data) {
    try {
      return await NotificationModel.methods.createNotification(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(page, limit) {
    try {
      return await NotificationModel.methods.getNotifications(page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await NotificationModel.methods.deleteNotification(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      return await NotificationModel.methods.updateNotification(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findOne(id) {
    try {
      return await NotificationModel.methods.getNotification(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllByUser(userId, page, limit) {
    try {
      return await NotificationModel.methods.getNotificationsByUserId(
        userId,
        page,
        limit
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findNotificationUnRead(userId){
    try {
      return await NotificationModel.methods.findNotificationUnRead(
        userId
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
};

export default NotificationService;
