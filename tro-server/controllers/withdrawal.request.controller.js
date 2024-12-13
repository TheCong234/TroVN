import WithdrawalRequestService from "../services/withdrawal.request.service.js";
import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import { logger } from "../config/winston.js";

const WithdrawalRequestController = {
  async create(req, res) {
    try {
      const data = req.body;
      const { user } = req;
      const newData = {
        ...data,
        userId: user.id,
      };
      const withdrawalRequest = await WithdrawalRequestService.create(newData);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success("Thành công", withdrawalRequest));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findByUserId(req, res) {
    try {
      const { id } = req.user;
      const { page, limit } = req.query;
      const data = await WithdrawalRequestService.findByUserId(id, page, limit);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findAll(req, res) {
    try {
      const { page, limit } = req.query;
      const data = await WithdrawalRequestService.findAll(page, limit);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const withdrawalRequest = await WithdrawalRequestService.update(id, data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", withdrawalRequest));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const withdrawalRequest = await WithdrawalRequestService.delete(id);
      return res
        .status(statusCode.NO_CONTENT)
        .json(BaseResponse.success("Thành công", withdrawalRequest));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default WithdrawalRequestController;
