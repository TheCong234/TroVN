import { logger } from "../config/winston.js";
import InvoiceModel from "../models/invoice.model.js";

const InvoiceService = {
  async createInvoice(data) {
    try {
      return await InvoiceModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(page, limit) {
    try {
      return await InvoiceModel.methods.findAll(page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findById(id) {
    try {
      return await InvoiceModel.methods.findById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findByRentedRoomId(id) {
    try {
      return await InvoiceModel.methods.findByRentedRoomId(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllByHostId(hostId, page, limit, isPayment) {
    try {
      return await InvoiceModel.methods.findAllByHostId(
        hostId,
        page,
        limit,
        isPayment
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllByUserId(userId, page, limit) {
    try {
      return await InvoiceModel.methods.findAllByUserId(userId, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteInvoice(id) {
    try {
      return await InvoiceModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteByRentedRoomId(id) {
    try {
      return await InvoiceModel.methods.deleteByRentedRoomId(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateInvoice(id, data) {
    try {
      return await InvoiceModel.methods.update(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default InvoiceService;
