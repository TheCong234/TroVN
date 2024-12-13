import cron from "node-cron";
import AppointmentModel from "../models/appointment.model.js";
import moment from "moment";
import NotificationModel from "../models/notification.model.js";
import { logger } from "../config/winston.js";

let isJobStarted = false;
const notificationJob = (io) => {
  cron.schedule("00 00 * * *", async () => {
    try {
      if (isJobStarted) return;
      isJobStarted = true;

      logger.info(
        "Chạy công việc theo lịch trình để thông báo các lịch hẹn sắp trong 24 giời tiếp theo."
      );
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const upcomingAppointments =
        await AppointmentModel.methods.upcomingAppointments(now, next24Hours);

      for (const appointment of upcomingAppointments) {
        const newNotification = {
          title: `Lịch hẹn của bạn vào ngày mai`,
          message: `Bạn có một cuộc hẹn vào ${moment(
            appointment.appointmentDate
          ).format("HH:mm DD-MM-YYYY")}`,
          data: appointment,
          type: "APPOINTMENT_SCHEDULED",
          userId: appointment.userId,
        };

        const notification = await NotificationModel.methods.createNotification(
          newNotification
        );

        io.to(appointment.userId).emit("notification", { data: notification });
      }
      effect = "blur";
    } catch (error) {
      logger.error(error);
    }
  });
};

export default notificationJob;
