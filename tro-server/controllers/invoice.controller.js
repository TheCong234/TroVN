import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import InvoiceService from "../services/invoice.service.js";

const SUCCESS_MESSAGE = "Thàng công";

const InvoiceController = {
  async create(req, res, next) {
    try {
      const { user } = req;
      const data = {
        ...req.body,
      };
      const invoice = await InvoiceService.createInvoice(data);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoice));
    } catch (error) {
      next(error);
    }
  },

  async findAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const invoices = await InvoiceService.findAll(page, limit);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoices));
    } catch (error) {
      next(error);
    }
  },

  async findAllByUserId(req, res, next) {
    try {
      const { user } = req;
      const { page, limit } = req.query;
      const invoices = await InvoiceService.findAllByUserId(
        user.id,
        page,
        limit
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoices));
    } catch (error) {
      next(error);
    }
  },

  async findByHostId(req, res, next) {
    try {
      const { user } = req;
      const { page, limit, isPayment } = req.query;
      const invoices = await InvoiceService.findAllByHostId(
        user.id,
        page,
        limit,
        isPayment
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoices));
    } catch (error) {
      next(error);
    }
  },

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.findById(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoice));
    } catch (error) {
      next(error);
    }
  },

  async updateInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const invoice = await InvoiceService.updateInvoice(id, data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoice));
    } catch (error) {
      next(error);
    }
  },

  async deleteInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.deleteInvoice(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoice));
    } catch (error) {
      next(error);
    }
  },

  async deleteByRentedRoomId(req, res, next) {
    try {
      const { id } = req.params;
      const invoice = await InvoiceService.deleteByRentedRoomId(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, invoice));
    } catch (error) {
      next(error);
    }
  },
};

export default InvoiceController;
