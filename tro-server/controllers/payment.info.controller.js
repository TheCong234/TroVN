import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import PaymentInfoService from "../services/payment.info.service.js";

const MESSAGE_SUCCESS = "Thành công";

const PaymentInfoController = {
  async create(req, res) {
    try {
      const data = {
        ...req.body,
        userId: req.user.id,
      };
      const paymentInfo = await PaymentInfoService.create(data);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success(MESSAGE_SUCCESS, paymentInfo));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const data = {
      ...req.body,
      userId: req.user.id,
    };
    try {
      const paymentInfo = await PaymentInfoService.update(id, data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(MESSAGE_SUCCESS, paymentInfo));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const paymentInfo = await PaymentInfoService.delete(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(MESSAGE_SUCCESS, paymentInfo));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getPaymentInfoByUserId(req, res) {
    const { id } = req.user;
    try {
      const paymentInfo = await PaymentInfoService.findByUserId(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(MESSAGE_SUCCESS, paymentInfo));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getPaymentInfoById(req, res) {
    const { id } = req.params;
    try {
      const paymentInfo = await PaymentInfoService.findById(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(MESSAGE_SUCCESS, paymentInfo));
    } catch (error) {
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default PaymentInfoController;
