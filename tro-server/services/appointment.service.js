import AppointmentModel from "../models/appointment.model.js";
import { AppointmentStatus } from "@prisma/client";
import ListingModel from "../models/listing.model.js";
import { logger } from "../config/winston.js";
import rentedRoomService from "./rented-room.service.js";
import { sendMail } from "../utils/mailer.utils.js";
import { appointmentTemplate } from "../utils/appointment.template.js";

const AppointmentService = {
  async create(data) {
    try {
      const { listingId, userId } = data;
      if (!listingId || !userId) {
        throw new Error("Không tìm thấy kết quả");
      }
      const existingAppointment =
        await AppointmentModel.methods.findHaveAppointment(listingId, userId);

      if (existingAppointment) {
        throw new Error("Đã đặt liên hệ");
      }
      return await AppointmentModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(userId, page, limit, fromDate, toDate) {
    try {
      return await AppointmentModel.methods.findAll(
        userId,
        parseInt(page),
        parseInt(limit),
        fromDate,
        toDate
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllByHost(userId, page = 1, limit = 20, fromDate, toDate, status) {
    try {
      const listingIds = await ListingModel.methods.getListingIdsByUser(userId);

      if (!listingIds || listingIds.length === 0) {
        return { message: "Bạn chưa có phòng nào" };
      }

      const appointmentPromises = listingIds.map((listingId) =>
        AppointmentModel.methods.findAllByListingId(
          listingId.id,
          page,
          limit,
          fromDate,
          toDate,
          status
        )
      );

      const allAppointments = await Promise.all(appointmentPromises);

      let listAppointment = allAppointments.flat();

      listAppointment.sort((a, b) => {
        const dateA = new Date(a.appointmentDate);
        const dateB = new Date(b.appointmentDate);
        return dateA - dateB;
      });

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedAppointments = listAppointment.slice(startIndex, endIndex);

      return {
        appointments: paginatedAppointments,
        total: listAppointment.length,
        page,
        limit,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await AppointmentModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteAppointmentByListingIdAndUserId(listingId, userId) {
    try {
      return await AppointmentModel.methods.deleteAppointmentByListingIdAndUserId(
        listingId,
        userId
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async update(id, updateData, baseFullUrl) {
    try {
      let updatedAppointment;
      const emailSubject = "Người cho thuê đã xác nhận lịch hẹn";

      if (updateData.status === AppointmentStatus.CANCELED) {
        return await AppointmentModel.methods.delete(id);
      }

      if (updateData.status === AppointmentStatus.DONE) {
        updatedAppointment = await AppointmentModel.methods.update(
          id,
          updateData
        );
        const { userId, listingId, user } = updatedAppointment;

        await rentedRoomService.create({
          userId,
          listingId,
          startDate: new Date(),
          endDate: new Date(),
          isOwnerConfirmed: true,
        });
        return updatedAppointment;
      }

      updatedAppointment = await AppointmentModel.methods.update(
        id,
        updateData
      );

      sendMail(
        updatedAppointment.user.email,
        emailSubject,
        appointmentTemplate(baseFullUrl, updatedAppointment)
      );
      return updatedAppointment;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async upcomingAppointments(now, next24Hours) {
    try {
      return await AppointmentModel.methods.upcomingAppointments(
        now,
        next24Hours
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default AppointmentService;
