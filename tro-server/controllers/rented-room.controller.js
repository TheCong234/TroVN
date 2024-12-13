import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";
import RentedRoomService from "../services/rented-room.service.js";

const RentedRoomController = {
  async getByHost(req, res, next) {
    try {
      const { user } = req;
      const { page, limit, status } = req.query;
      const rooms = await RentedRoomService.getRentedRoomsByHost(
        user.id,
        page,
        limit,
        status
      );
      if (!rooms) {
        return res
          .status(statusCode.NOT_FOUND)
          .json(BaseResponse.error("Không tìm thấy kết quả", null));
      }
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", rooms));
    } catch (error) {
      next(error);
    }
  },

  async getAllByUser(req, res, next) {
    try {
      const { user } = req;
      const { page, limit } = req.query;

      const rooms = await RentedRoomService.getAllRentedRoomsByUser(
        user.id,
        page,
        limit
      );

      if (!rooms) {
        return res
          .status(statusCode.NOT_FOUND)
          .json(BaseResponse.error("Không tìm thấy kết quả", null));
      }
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", rooms));
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const room = await RentedRoomService.getRentedRoomById(id);
      if (!room) {
        return res
          .status(statusCode.NOT_FOUND)
          .json(BaseResponse.error("Không tìm thấy kết quả", null));
      }
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", room));
    } catch (error) {
      next(error);
    }
  },

  async updateRentedRoom(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const existingRoom = await RentedRoomService.getRentedRoomById(id);
      if (!existingRoom) {
        return res
          .status(statusCode.NOT_FOUND)
          .json(BaseResponse.error("Không tìm thấy kết quả", null));
      }
      const room = await RentedRoomService.updateRentedRoom(id, data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", room));
    } catch (error) {
      next(error);
    }
  },

  async deleteRentedRoom(req, res, next) {
    try {
      const { id } = req.params;
      const room = await RentedRoomService.deleteRentedRoom(id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", room));
    } catch (error) {
      next(error);
    }
  },
};
export default RentedRoomController;
