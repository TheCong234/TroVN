import { logger } from "../config/winston.js";
import TransactionHistoryModel from "../models/transaction.history.model.js";

const TransactionHistoryService = {
  async createTransactionHistory(data) {
    try {
      return await TransactionHistoryModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateTransactionHistory(id, data) {
    try {
      return await TransactionHistoryModel.methods.update(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteTransactionHistory(id) {
    try {
      return await TransactionHistoryModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(page, limit) {
    try {
      return await TransactionHistoryModel.methods.findAll(page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllByUserId(userId, page, limit) {
    try {
      return await TransactionHistoryModel.methods.findAllByUserId(
        userId,
        page,
        limit
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findById(id) {
    try {
      return await TransactionHistoryModel.methods.findById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default TransactionHistoryService;
