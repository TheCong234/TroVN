import ConversationModel from "../models/conversation.model.js";
import { logger } from "../config/winston.js";

const ConversationService = {
  async getConversations(currentUserId) {
    try {
      return await ConversationModel.methods.getConversations(currentUserId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getConversationById(id) {
    try {
      return await ConversationModel.methods.findById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getConversationMessageById(id) {
    try {
      return ConversationModel.methods.findMessageById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getConversationMessage(userOneId, userTwoId, listingId) {
    try {
      return ConversationModel.methods.getConversationMessage(
        userOneId,
        userTwoId,
        listingId
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getConversation(userOneId, userTwoId, listingId) {
    try {
      return ConversationModel.methods.findOne(userOneId, userTwoId, listingId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async createConversation(sender, receiver, listingId) {
    try {
      return ConversationModel.methods.createConversation(
        sender,
        receiver,
        listingId
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateAtConversation(id) {
    try {
      return ConversationModel.methods.updatedAtConversation(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateConversation(id, data, user) {
    try {
      const existing = await ConversationModel.methods.findById(id);
      if (!existing) {
        throw new Error("Không tim thấy cuộc trò chuyện");
      }
      if (existing.sender.id !== user.id || existing.receiver.id !== user.id) {
        throw new Error("Bạn không thể  cập nhật cuộc trò chuyện này");
      }
      return await ConversationModel.methods.updateConversation(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteConversation(id) {
    try {
      return await ConversationModel.methods.deleteConversation(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default ConversationService;
