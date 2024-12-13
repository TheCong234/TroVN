import db from "../lib/db.js";

const TransactionHistoryModel = {
  methods: {
    async create(payload) {
      return await db.transactionHistory.create({
        data: payload,
      });
    },
    async update(id, payload) {
      return await db.transactionHistory.update({
        where: {
          id,
        },
        data: payload,
      });
    },
    async delete(id) {
      return await db.transactionHistory.delete({
        where: {
          id,
        },
      });
    },
    async findById(id) {
      return await db.transactionHistory.findUnique({
        where: {
          id,
        },
      });
    },
    async findAllByUserId(userId, page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [totalElement, contents] = await db.$transaction([
        db.transactionHistory.count({
          where: {
            userId,
          },
        }),
        db.transactionHistory.findMany({
          where: {
            userId,
          },
          skip,
          take: parseInt(limit),
        }),
      ]);

      return {
        totalElement,
        contents,
        currentPage: page,
        totalPage: Math.ceil(totalElement / limit),
      };
    },
    async findAll(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [totalElement, contents] = await db.$transaction([
        db.transactionHistory.count(),
        db.transactionHistory.findMany({
          skip,
          take: parseInt(limit),
        }),
      ]);
      return {
        totalElement,
        contents,
        currentPage: page,
        totalPage: Math.ceil(totalElement / limit),
      };
    },
  },
};

export default TransactionHistoryModel;
