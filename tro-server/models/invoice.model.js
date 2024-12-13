import db from "../lib/db.js";

const InvoiceModel = {
  methods: {
    async create(data) {
      return await db.invoice.create({
        data,
        include: {
          rentedRoom: {
            include: {
              listing: {
                select: {
                  id: true,
                  address: true,
                  title: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    },

    async findAll(page, limit) {
      const skip = (page - 1) * limit;
      const [count, invoices] = await db.$transaction([
        db.invoice.count(),
        db.invoice.findMany({
          skip,
          take: parseInt(limit),
        }),
      ]);
      return {
        contents: invoices,
        totalElement: count,
      };
    },

    async findById(id) {
      return await db.invoice.findUnique({
        where: { id },
      });
    },

    async findByRentedRoomId(rentedRoomId) {
      return await db.invoice.findMany({
        where: {
          rentedRoomId,
        },
      });
    },

    async findAllByHostId(hostId, page, limit, isPayment = undefined) {
      const skip = (page - 1) * limit;

      const whereCondition = {
        rentedRoom: {
          listing: {
            userId: hostId,
          },
        },
      };

      if (isPayment !== undefined) {
        whereCondition.paymentStatus = Boolean(isPayment);
      }

      const [count, invoices] = await db.$transaction([
        db.invoice.count({
          where: whereCondition,
        }),
        db.invoice.findMany({
          skip,
          take: parseInt(limit),
          where: whereCondition,
          include: {
            rentedRoom: {
              include: {
                listing: {
                  include: {
                    images: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    avatarUrl: true,
                    fullName: true,
                    phoneNumber: true,
                    email: true,
                    address: true,
                    isVerify: true,
                    role: true,
                  },
                },
              },
            },
          },
        }),
      ]);
      return {
        totalElement: count,
        contents: invoices,
      };
    },

    async findAllByUserId(userId, page, limit, isPayment = undefined) {
      const skip = (page - 1) * limit;
      const [count, invoices] = await db.$transaction([
        db.invoice.count({
          where: {
            rentedRoom: {
              userId: userId,
            },
          },
        }),
        db.invoice.findMany({
          skip,
          take: parseInt(limit),
          where: {
            rentedRoom: {
              userId: userId,
            },
          },
          orderBy: {
            paymentStatus: "asc",
          },
        }),
      ]);

      return {
        totalElement: count,
        contents: invoices,
      };
    },

    async update(id, data) {
      return await db.invoice.update({
        where: {
          id,
        },
        data,
      });
    },

    async deleteByRentedRoomId(rentedRoomId) {
      return await db.invoice.deleteMany({
        where: {
          rentedRoomId,
        },
      });
    },

    async delete(id) {
      return await db.invoice.delete({
        where: {
          id,
        },
      });
    },

    async getInvoiceCount(userId) {
      const [invoicePaidCount, invoiceNotPaidCount] = await db.$transaction([
        db.invoice.count({
          where: {
            rentedRoom: {
              listing: {
                userId,
              },
            },
            paymentStatus: true,
          },
        }),
        db.invoice.count({
          where: {
            rentedRoom: {
              listing: {
                userId,
              },
            },
            paymentStatus: false,
          },
        }),
      ]);
      return { invoicePaidCount, invoiceNotPaidCount };
    },
  },
};

export default InvoiceModel;
