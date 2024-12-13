import db from "../lib/db.js";

const NotificationModel = {
  methods: {
    async createNotification(data) {
      return await db.notification.create({
        data: data,
      });
    },

    async updateNotification(id, data) {
      return await db.notification.update({
        where: {
          id,
        },
        data: data,
      });
    },

    async deleteNotification(id) {
      return await db.notification.delete({
        where: {
          id,
        },
      });
    },

    async getNotifications(page, limit) {
      const skip = (page - 1) * limit;
      const [count, notifications] = await db.$transaction([
        db.notification.count(),
        db.notification.findMany({
          skip,
          take: parseInt(limit),
        }),
      ]);

      return {
        totalElement: count,
        contents: notifications,
      };
    },

    async getNotification(id) {
      return await db.notification.findUnique({
        where: {
          id,
        },
      });
    },

    async getNotificationsByUserId(id, page, limit) {
      const skip = (page - 1) * limit;

      const [count, unReadCount, notifications] = await db.$transaction([
        db.notification.count({
          where: {
            userId: id,
          },
        }),
        db.notification.count({
          where: {
            userId: id,
            isRead: false,
          },
        }),
        db.notification.findMany({
          where: {
            userId: id,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: skip,
          take: parseInt(limit),
        }),
      ]);

      return {
        totalElement: count,
        contents: notifications,
        unReadCount,
      };
    },
    async findNotificationUnRead(userId){
      const [rentedRoomCount, orderItemCount, appointmentCount] = await db.$transaction([
        db.rentedRoom.count({
          where: {
            userId,
            isTenantConfirmed: false,
            status: "PENDING"
          }
        }),
        db.orderItem.count({
          where: {
            userId,
            invoice: {
              paymentStatus: false
            }
          }
        }),
        db.appointment.count({
          where: {
            userId,
            status: "PENDING"
          }
        })
      ])
      return {
        rentedRoomCount,
        orderItemCount,
        appointmentCount
      }
    }
  },

};
export default NotificationModel;
