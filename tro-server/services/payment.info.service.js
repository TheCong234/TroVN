import { logger } from "../config/winston.js";
import paymentInfoModel from "../models/payment.info.model.js";

const PaymentInfoService = {
  async create(data) {
    try {
      return await paymentInfoModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async update(id, data) {
    try {
      return await paymentInfoModel.methods.update(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async delete(id) {
    try {
      return await paymentInfoModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async findById(id) {
    try {
      return await paymentInfoModel.methods.findById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async findByUserId(userId) {
    try {
      return await paymentInfoModel.methods.findByUserId(userId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default PaymentInfoService;
