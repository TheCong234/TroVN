import { logger } from "../config/winston.js";
import WithdrawalRequestModel from "../models/withdrawal.request.model.js";
import db from "../lib/db.js";
import {
  TransactionStatus,
  TransactionType,
  WithdrawalStatus,
} from "@prisma/client";

const WithdrawalRequestService = {
  async create(payload) {
    try {
      return await WithdrawalRequestModel.methods.create(payload);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async update(id, payload) {
    try {
      return await db.$transaction(async (prismaClient) => {
        const existingWithdrawalRequest =
          await prismaClient.withdrawalRequest.findUnique({
            where: { id },
          });

        if (!existingWithdrawalRequest) {
          throw new Error("Withdrawal request not found");
        }

        if (["COMPLETED", "REJECTED", "APPROVED"].includes(payload?.status)) {
          const fee = existingWithdrawalRequest.amount * 0.05;
          const netAmount = existingWithdrawalRequest.amount - fee;

          await prismaClient.transactionHistory.create({
            data: {
              type: TransactionType.WITHDRAWAL,
              amount: existingWithdrawalRequest.amount,
              fee,
              netAmount,
              status:
                payload.status === WithdrawalStatus.COMPLETED
                  ? TransactionStatus.SUCCESS
                  : TransactionStatus.FAILED,
              userId: existingWithdrawalRequest.userId,
              withdrawalRequestId: existingWithdrawalRequest.id,
            },
          });
        }

        const updatedRequest = await prismaClient.withdrawalRequest.update({
          where: { id },
          data: payload,
        });

        return updatedRequest;
      });
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await WithdrawalRequestModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findByUserId(userId, page, limit) {
    try {
      return await WithdrawalRequestModel.methods.findByUserId(
        userId,
        page,
        limit
      );
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(page, limit) {
    try {
      return await WithdrawalRequestModel.methods.findAll(page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default WithdrawalRequestService;
