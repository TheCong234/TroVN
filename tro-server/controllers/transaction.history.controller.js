import TransactionHistoryService from "../services/transaction.history.service.js";
import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
const SUCCESS_MESSAGE = "Thành công";
const TransactionHistoryController = {
  async create(req, res) {
    try {
      const { user } = req;
      const data = {
        ...req.body,
        userId: user.id,
      };
      const transactionHistory = await TransactionHistoryService.create(data);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success(SUCCESS_MESSAGE, transactionHistory));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findByUser(req, res) {
    try {
      const { user } = req;
      const { page, limit } = req.query;
      const transactionHistories =
        await TransactionHistoryService.findAllByUserId(user.id, page, limit);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, transactionHistories));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default TransactionHistoryController;
