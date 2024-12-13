import db from "../lib/db.js";

const AppointmentModel = {
  methods: {
    async create(data) {
      return await db.appointment.create({ data });
    },

    async findAll(
      userId,
      page = 1,
      limit = 10,
      fromDate = undefined,
      toDate = undefined
    ) {
      const offset = (page - 1) * limit;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let dateCondition = {};
      if (fromDate && toDate) {
        dateCondition = {
          appointmentDate: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        };
      } else if (fromDate) {
        dateCondition = {
          appointmentDate: {
            gte: new Date(fromDate),
          },
        };
      } else if (toDate) {
        dateCondition = {
          appointmentDate: {
            lte: new Date(toDate),
          },
        };
      } else {
        dateCondition = {
          appointmentDate: {
            gte: today,
          },
        };
      }

      return await db.appointment.findMany({
        where: {
          userId,
          ...dateCondition,
        },
        skip: offset,
        take: limit,
        orderBy: {
          appointmentDate: "asc",
        },
        include: {
          listing: {
            select: {
              title: true,
              id: true,
              address: true,
              images: true,
              user: {
                select: {
                  fullName: true,
                  avatarUrl: true,
                  id: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });
    },

    async findAllByListingId(
      listingId,
      page = 1,
      limit = 10,
      fromDate = null,
      toDate = null,
      status = null
    ) {
      const offset = (page - 1) * limit;

      let dateCondition = {};
      if (fromDate && toDate) {
        dateCondition = {
          appointmentDate: {
            gte: new Date(fromDate),
            lte: new Date(toDate),
          },
        };
      } else if (fromDate) {
        dateCondition = {
          appointmentDate: {
            gte: new Date(fromDate),
          },
        };
      } else if (toDate) {
        dateCondition = {
          appointmentDate: {
            lte: new Date(toDate),
          },
        };
      }

      if (status) {
        dateCondition = {
          ...dateCondition,
          status: status,
        };
      }

      return await db.appointment.findMany({
        where: {
          listingId,
          ...dateCondition,
        },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              address: true,
              email: true,
              avatarUrl: true,
              fullName: true,
            },
          },
          listing: {
            select: {
              id: true,
              address: true,
              area: true,
              hot: true,
              images: true,
              price: true,
              title: true,
            },
          },
        },
        orderBy: {
          appointmentDate: "asc",
        },
      });
    },

    async findHaveAppointment(userId, listingId) {
      return await db.appointment.findFirst({
        where: {
          userId,
          listingId,
          OR: [{ status: "PENDING" }, { status: "CONFIRMER" }],
        },
      });
    },

    async getOwnerListingById(id) {
      const appointment = await db.appointment.findFirst({
        where: {
          id,
        },
        include: {
          listing: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
            select: {
              id: true,
            },
          },
        },
      });
      return appointment.listing.user.id;
    },

    async delete(id) {
      return await db.appointment.delete({ where: { id } });
    },

    async deleteAppointmentByListingIdAndUserId(listingId, userId) {
      return await db.appointment.deleteMany({
        where: {
          userId,
          listingId,
        },
      });
    },

    async update(id, data) {
      return await db.appointment.update({
        where: { id },
        data,
        include: {
          listing: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                  address: true,
                  phoneNumber: true,
                  avatarUrl: true,
                  id: true,
                },
              },
            },
          },
          user: {
            select: {
              fullName: true,
              email: true,
              address: true,
              phoneNumber: true,
              avatarUrl: true,
              id: true,
            },
          },
        },
      });
    },
    async upcomingAppointments(now, next24Hours) {
      return db.appointment.findMany({
        where: {
          appointmentDate: {
            gte: now,
            lte: next24Hours,
          },
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              address: true,
              images: {
                skip: 1,
                take: 1,
              },
              price: true,
            },
          },
        },
      });
    },

    async getCountAppointmentsByDate(userId, startOfDay, endOfDay) {
      return await db.appointment.count({
        where: {
          listing: {
            userId,
          },
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
    },
  },
};

export default AppointmentModel;
