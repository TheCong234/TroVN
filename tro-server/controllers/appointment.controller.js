import AppointmentService from "../services/appointment.service.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import { statusCode } from "../config/statusCode.js";

const AppointmentController = {
  async create(req, res) {
    try {
      const { user } = req;
      const data = {
        ...req.body,
        userId: user.id,
      };
      const response = await AppointmentService.create(data);
      return res
        .status(statusCode.CREATED)
        .json(BaseResponse.success("Thành công", response));
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findAll(req, res) {
    try {
      const { user } = req;
      const { page, limit, fromDate, toDate } = req.query;
      const response = await AppointmentService.findAll(
        user.id,
        page,
        limit,
        fromDate,
        toDate
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", response));
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findAllByHost(req, res) {
    try {
      const { user } = req;
      const { page, limit, fromDate, toDate, status } = req.query;
      const response = await AppointmentService.findAllByHost(
        user.id,
        parseInt(page),
        parseInt(limit),
        fromDate,
        toDate,
        status
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", response));
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const response = await AppointmentService.delete(id);
      return res
        .status(statusCode.NO_CONTENT)
        .json(BaseResponse.success("Thành công", null));
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async update(req, res) {
    try {
      const { user } = req;
      const url = req?.headers?.origin;
      const { id } = req.params;
      const data = {
        ...req.body,
        // userId: user.id,
      };
      const response = await AppointmentService.update(id, data, url);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", response));
    } catch (error) {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default AppointmentController;
