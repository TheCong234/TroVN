import db from "../lib/db.js";

const PaymentInfoModel = {
  methods: {
    async create(data) {
      return await db.$transaction(async (tx) => {
        if (data.isPrimary) {
          await tx.paymentInfo.updateMany({
            where: {
              userId: data.userId,
              isPrimary: true,
            },
            data: {
              isPrimary: false,
            },
          });
        }

        return await tx.paymentInfo.create({
          data,
        });
      });
    },

    async update(id, payload) {
      return await db.$transaction(async (tx) => {
        if (payload.isPrimary) {
          await tx.paymentInfo.updateMany({
            where: {
              userId: payload.userId,
              isPrimary: true,
              NOT: { id },
            },
            data: {
              isPrimary: false,
            },
          });
        }

        return await tx.paymentInfo.update({
          where: {
            id,
          },
          data: payload,
        });
      });
    },

    async delete(id) {
      return await db.paymentInfo.delete({
        where: {
          id,
        },
      });
    },

    async findById(id) {
      return await db.paymentInfo.findUnique({
        where: {
          id,
        },
      });
    },

    /**
     * Retrieves all payment information records associated with a specific user.
     *
     * @param {String} userId - The ID of the user whose payment information is to be retrieved.
     * @returns {Promise<Array>} A promise that resolves to an array of payment information objects.
     */
    async findByUserId(userId) {
      return await db.paymentInfo.findMany({
        where: {
          userId,
        },
        orderBy: {
          isPrimary: "desc",
        },
      });
    },
  },
};

export default PaymentInfoModel;
