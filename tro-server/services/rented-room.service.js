import { logger } from "../config/winston.js";
import rentedRoomModel from "../models/rented-room.model.js";
import appointmentService from "./appointment.service.js";
import listingService from "./listing.service.js";

const RentedRoomService = {
  async create(data) {
    try {
      return await rentedRoomModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async getRentedRoomsByHost(userId, page, limit, status) {
    try {
      return await rentedRoomModel.methods.getRentedRoomsByHost(
        userId,
        page,
        limit,
        status
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getAllRentedRoomsByUser(userId, page, limit) {
    try {
      return await rentedRoomModel.methods.getRentedRoomsByUserId(
        userId,
        page,
        limit
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async updateRentedRoom(id, data) {
    try {
      if (data?.isTenantConfirmed) {
        const existingRentedRoom = await rentedRoomModel.methods.finById(id);
        console.log(existingRentedRoom);

        if (!existingRentedRoom) {
          throw new Error("Không tìm thấy kết quả");
        }

        await listingService.updateListing(existingRentedRoom.listingId, {
          isPublish: false,
          userId: existingRentedRoom.listing.user.id,
        });

        const rentedRoom = await rentedRoomModel.methods.update(id, {
          ...data,
          status: "CONFIRMER",
        });

        console.log(rentedRoom);

        await appointmentService.deleteAppointmentByListingIdAndUserId(
          rentedRoom.listingId,
          rentedRoom.userId
        );

        return rentedRoom;
      }
      return await rentedRoomModel.methods.update(id, data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getRentedRoomById(id) {
    try {
      return await rentedRoomModel.methods.getById(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async hasRentedRoom(listingId) {
    try {
      return await rentedRoomModel.methods.hasRentedRoom(listingId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async getRentedRoomByListingIdAndUserId(listingId, userId) {
    try {
      return await rentedRoomModel.methods.getRentedRoomByListingIdAndUserId(
        listingId,
        userId
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteRentedRoom(id) {
    try {
      return await rentedRoomModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default RentedRoomService;
