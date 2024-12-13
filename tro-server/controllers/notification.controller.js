import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import NotificationService from "../services/notification.service.js";

const SUCCESS_MESSAGE = "Thành công";

const NotificationController = {
  async create(req, res, next) {
    try {
      const data = req.body;
      const notification = await NotificationService.create(data);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success(SUCCESS_MESSAGE, notification));
    } catch (error) {
      next(error);
    }
  },
  async findAllByUser(req, res, next) {
    try {
      const { user } = req;
      const { page, limit } = req.query;
      const notifications = await NotificationService.findAllByUser(
        user.id,
        page,
        limit
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, notifications));
    } catch (error) {
      next(error);
    }
  },

  async getCountNotificationUnRead(req, res, next) {
    try {
      const { user } = req;
      const data = await NotificationService.findNotificationUnRead(user.id);
      return res
      .status(statusCode.OK)
      .json(BaseResponse.success(SUCCESS_MESSAGE, data));
    } catch (error) {
      next(error)
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const notification = await NotificationService.update(id, data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, notification));
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await NotificationService.delete(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success(SUCCESS_MESSAGE, notification));
    } catch (error) {
      next(error);
    }
  },
};
export default NotificationController;
