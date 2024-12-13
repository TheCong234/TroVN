import db from "../lib/db.js";

const OrderModel = {
  methods: {
    async createOrder(data) {
      return db.orderItem.create({
        data: data,
      });
    },

    async getOrdersByUserId(userId, type) {
      const where = { userId };

      if (type === "advertisingPackage") {
        where.advertisingPackageId = { not: null };
      } else if (type === "invoice") {
        where.invoiceId = { not: null };
      }

      return db.orderItem.findMany({
        where,
        include: {
          advertisingPackage: true,
          invoice: true,
          payment: true,
          user: {
            select: {
              id: true,
              username: true,
              address: true,
              avatarUrl: true,
              phoneNumber: true,
              isPremium: true,
              isVerify: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    

    async getOrderByAdsPackageId(id) {
      return db.orderItem.findMany({
        where: {
          advertisingPackageId: id,
        },
        include: {
          advertisingPackage: true,
          payment: true,
          user: {
            select: {
              id: true,
              username: true,
              address: true,
              avatarUrl: true,
              phoneNumber: true,
              isPremium: true,
              isVerify: true,
              role: true,
            },
          },
        },
      });
    },
  },
};

export default OrderModel;
