import db from "../lib/db.js";

const WithdrawalRequestModel = {
  methods: {
    async create(payload) {
      return await db.withdrawalRequest.create({
        data: payload,
      });
    },

    async findByUserId(userId, page = 1, limit = 10) {
      const offset = (page - 1) * limit;
      const [totalElement, contents] = await db.$transaction([
        db.withdrawalRequest.count({
          where: {
            userId,
          },
        }),
        db.withdrawalRequest.findMany({
          where: {
            userId,
          },
          include: {
            paymentInfo: {
              select: {
                accountName: true,
                accountNumber: true,
                provider: true,
              },
            },
          },
          take: parseInt(limit),
          skip: offset,
          orderBy: {
            status: "asc",
          },
        }),
      ]);
      return {
        totalElement,
        contents,
      };
    },

    async findAll(page = 1, limit = 10) {
      const offset = (page - 1) * limit;
      const [totalElement, contents] = await db.$transaction([
        db.withdrawalRequest.count(),
        db.withdrawalRequest.findMany({
          skip: offset,
          take: parseInt(limit),
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                avatarUrl: true,
                phoneNumber: true,
              },
            },
            paymentInfo: {
              select: {
                accountName: true,
                accountNumber: true,
                provider: true,
              },
            },
          },
        }),
      ]);
      return {
        totalElement,
        contents,
      };
    },

    async findById(id) {
      return await db.withdrawalRequest.findUnique({
        where: {
          id,
        },
      });
    },

    async delete(id) {
      return await db.withdrawalRequest.delete({
        where: {
          id,
        },
      });
    },

    async update(id, payload) {
      return await db.withdrawalRequest.update({
        where: {
          id,
        },
        data: payload,
      });
    },
  },
};

export default WithdrawalRequestModel;
