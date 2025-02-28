import { statusCode } from "../config/statusCode.js";
import { logger } from "../config/winston.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import AnalyticsService from "../services/analytics.service.js";

const AnalyticsController = {
  async getOrdersByUserId(req, res) {
    try {
      const data = await AnalyticsService.getListingsForChart();
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getAmountPayment(req, res) {
    try {
      const data = await AnalyticsService.getAmountPayment();
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getCountNewUserRegister(req, res) {
    try {
      const data = await AnalyticsService.getCountNewUserRegister();
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getTop10UsersWithMostListings(req, res) {
    try {
      const data = await AnalyticsService.getTop10UsersWithMostListings();
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getCountListingByLocationForChart(req, res) {
    try {
      const data = await AnalyticsService.getCountListingByLocationForChart();
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async getCountAppointmentsByUserId(req, res) {
    try {
      const { user } = req;
      const data = await AnalyticsService.getCountAppointmentsByUserId(user.id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async getListingActiveAndNonActive(req, res) {
    try {
      const { user } = req;
      const data = await AnalyticsService.getListingActiveAndNonActive(user.id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getBalanceInProcess(req, res) {
    try {
      const { user } = req;
      const data = await AnalyticsService.getBalanceInProcess(user.id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async getInvoiceCount(req, res) {
    try {
      const { user } = req;
      const data = await AnalyticsService.getInvoiceCount(user.id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", data));
    } catch (error) {
      logger.error(error);
      return res
        .status(statusCode.BAD_REQUEST)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default AnalyticsController;
