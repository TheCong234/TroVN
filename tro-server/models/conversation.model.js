import dayjs from "dayjs";
import db from "../lib/db.js";
import { logger } from "../config/winston.js";

const UserModel = {
  methods: {
    async getConversations(currentUserId) {
      // Lấy danh sách cuộc hội thoại của người dùng
      const currentUserConversation = await db.conversation.findMany({
        where: {
          OR: [{ userOneId: currentUserId }, { userTwoId: currentUserId }],
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          messages: {
            skip: 1,
            take: 30,
          },
          userOne: {
            select: {
              id: true,
              fullName: true,
              role: true,
              address: true,
              avatarUrl: true,
            },
          },
          userTwo: {
            select: {
              id: true,
              fullName: true,
              role: true,
              address: true,
              avatarUrl: true,
            },
          },
          listing: {
            select: {
              images: true,
              title: true,
              id: true,
              userId: true,
              price: true,
              address: true,
              area: true,
              Appointment: {
                select: {
                  id: true,
                  userId: true,
                },
              },
            },
          },
        },
      });

      const res = currentUserConversation.map((conv) => {
        const hasAppointment = conv?.listing?.Appointment?.some(
          (appt) => appt.userId === currentUserId
        );

        return {
          id: conv?.id,
          sender: conv?.userTwo,
          updatedAt: conv?.updatedAt,
          receiver: conv?.userOne,
          lastMsg: conv.messages[conv?.messages?.length - 1],
          listing: conv?.listing,
          rented: conv?.rented,
          hasAppointment: !!hasAppointment,
        };
      });
      return res;
    },

    async findOne(senderId, receiverId, listingId) {
      return await db.conversation.findFirst({
        where: {
          OR: [
            { userOneId: senderId, userTwoId: receiverId, listingId },
            { userOneId: receiverId, userTwoId: senderId, listingId },
          ],
        },
      });
    },

    async findMessageById(id) {
      return await db.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            take: 30,
            skip: 1,
          },
        },
      });
    },

    async findById(id) {
      const conversation = await db.conversation.findFirst({
        where: {
          id,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          messages: {
            skip: 1,
            take: 30,
          },
          userOne: {
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true,
              avatarUrl: true,
              role: true,
            },
          },
          userTwo: {
            select: {
              id: true,
              username: true,
              email: true,
              fullName: true,
              avatarUrl: true,
              role: true,
            },
          },
          listing: {
            select: {
              images: true,
              title: true,
              id: true,
              userId: true,
              price: true,
              address: true,
              area: true,
            },
          },
        },
      });

      return {
        id: conversation?.id,
        sender: conversation?.userTwo,
        updatedAt: conversation?.updatedAt,
        receiver: conversation?.userOne,
        lastMsg: conversation.messages[conversation?.messages?.length - 1],
        listing: conversation?.listing,
      };
    },

    async getConversationMessage(senderId, receiverId, listingId) {
      return await db.conversation.findFirst({
        where: {
          OR: [
            { userOneId: senderId, userTwoId: receiverId, listingId },
            { userOneId: receiverId, userTwoId: senderId, listingId },
          ],
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            skip: 1,
            take: 30,
          },
        },
      });
    },

    async createConversation(sender, receiver, listingId) {
      return await db.conversation.create({
        data: {
          userOneId: sender,
          userTwoId: receiver,
          listingId: listingId,
        },
      });
    },

    async updatedAtConversation(id) {
      return await db.conversation.update({
        where: {
          id,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    },

    async updateConversation(id, data) {
      return await db.conversation.update({
        where: {
          id,
        },
        data,
      });
    },

    async deleteConversation(id) {
      return await db.conversation.delete({
        where: {
          id,
        },
      });
    },
  },
};

export default UserModel;
