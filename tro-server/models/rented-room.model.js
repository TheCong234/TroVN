import { logger } from "../config/winston.js";
import db from "../lib/db.js";

const RentedRoomModel = {
  methods: {
    /**
     * @function create
     * @description Create a new rented room
     * @param {object} rentedRoomData - The data for the rented room
     * @returns {Promise<RentedRoom>} - The newly created rented room
     */
    async create(rentedRoomData) {
      return await db.rentedRoom.create({
        data: rentedRoomData,
        include: {
          user: {
            select: {
              fullName: true,
              address: true,
              avatarUrl: true,
              email: true,
              phoneNumber: true,
            },
          },
          listing: {
            include: {
              user: {
                select: {
                  fullName: true,
                  address: true,
                  avatarUrl: true,
                  email: true,
                  phoneNumber: true,
                  id: true,
                },
              },
            },
          },
        },
      });
    },

    /**
     * @function getAll
     * @description Get all rented rooms with pagination
     * @param {number} [page=1] - The page number
     * @param {number} [limit=10] - The number of items per page
     * @returns {Promise<{ contents: RentedRoom[], totalElement: number }>}
     */
    async getAll(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [{ count }, contents] = await db.$transaction([
        db.rentedRoom.count(),
        db.rentedRoom.findMany({
          skip,
          take: limit,
        }),
      ]);
      return {
        contents,
        totalElement: count,
      };
    },

    /**
     * @function getById
     * @description Get a rented room by its id
     * @param {string} id - The id of the rented room
     * @returns {Promise<RentedRoom | null>} - The rented room with the given id, or null if not found
     */
    async getById(id) {
      return await db.rentedRoom.findUnique({
        where: {
          id,
        },
        include: {
          listing: {
            include: {
              user: {
                select: {
                  id: true,
                  avatarUrl: true,
                  fullName: true,
                  address: true,
                  email: true,
                },
              },
              listingAmenities: {
                include: {
                  amenity: true,
                },
              },
              images: true,
            },
          },
          user: {
            select: {
              id: true,
              avatarUrl: true,
              fullName: true,
              address: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });
    },

    async finById(id) {
      return await db.rentedRoom.findUnique({
        where: {
          id,
        },
        include: {
          listing: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
    },

    async delete(id) {
      return await db.rentedRoom.delete({
        where: {
          id,
        },
      });
    },

    async update(id, data) {
      return await db.rentedRoom.update({
        where: {
          id,
        },
        data,
        include: {
          listing: {
            select: {
              id: true,
              userId: true,
              address: true,
              title: true,
              images: {
                skip: 1,
                take: 1,
              },
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              avatarUrl: true,
              fullName: true,
              address: true,
              email: true,
            },
          },
        },
      });
    },

    async getRentedRoomsByUserId(userId, page = 1, limit = 10) {
      const offset = (page - 1) * limit;

      const [count, rentedRooms] = await db.$transaction([
        db.rentedRoom.count({
          where: {
            userId,
          },
        }),
        db.rentedRoom.findMany({
          where: {
            userId,
          },
          include: {
            listing: {
              select: {
                address: true,
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    address: true,
                    avatarUrl: true,
                    email: true,
                  },
                },
                id: true,
                images: true,
                title: true,
                address: true,
                area: true,
                price: true,
                description: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          skip: offset,
          take: parseInt(limit),
        }),
      ]);

      return {
        contents: rentedRooms,
        totalElement: count,
      };
    },

    async getRentedRoomsByListingId(listingId, page = 1, limit = 10) {
      const offset = (page - 1) * limit;

      const [{ count }, rentedRooms] = await db.$transaction([
        db.rentedRoom.count({
          where: {
            listingId,
          },
        }),
        db.rentedRoom.findMany({
          where: {
            listingId,
          },
          skip: offset,
          take: limit,
        }),
      ]);

      return {
        contents: rentedRooms,
        totalElement: count,
      };
    },

    async getRentedRoomByRentedRoomId(rentedRoomId) {
      return await db.rentedRoom.findUnique({
        where: {
          id: rentedRoomId,
        },
      });
    },

    async getRentedRoomByListingIdAndUserId(listingId, userId) {
      return await db.rentedRoom.findFirst({
        where: {
          listingId,
          userId,
        },
      });
    },

    async deleteByListingId(listingId) {
      return await db.rentedRoom.deleteMany({
        where: {
          listingId,
        },
      });
    },

    async deleteByUserId(userId) {
      return await db.rentedRoom.deleteMany({
        where: {
          userId,
        },
      });
    },

    async deleteByRentedRoomId(rentedRoomId) {
      return await db.rentedRoom.deleteMany({
        where: {
          id: rentedRoomId,
        },
      });
    },

    async deleteByListingIdAndUserId(listingId, userId) {
      return await db.rentedRoom.deleteMany({
        where: {
          listingId,
          userId,
        },
      });
    },

    async getRentedRoomsByHost(
      hostId,
      page = 1,
      limit = 10,
      status = undefined
    ) {
      const skip = (page - 1) * limit;
      const [count, rentedRooms] = await db.$transaction([
        db.rentedRoom.count({
          where: {
            listing: {
              userId: hostId,
            },
            NOT: {
              status: "CANCELLED",
              isOwnerConfirmed: false,
              isTenantConfirmed: false,
            },
          },
        }),
        db.rentedRoom.findMany({
          where: {
            listing: {
              userId: hostId,
            },
            NOT: {
              status: "CANCELLED",
              isOwnerConfirmed: false,
              isTenantConfirmed: false,
            },
          },
          skip,
          take: parseInt(limit),
          orderBy: {
            createdAt: "desc",
          },
          include: {
            listing: {
              select: {
                id: true,
                images: true,
                address: true,
                area: true,
                title: true,
                price: true,
                description: true,
                hot: true,
                latitude: true,
                longitude: true,
              },
            },
            user: {
              select: {
                fullName: true,
                id: true,
                avatarUrl: true,
                email: true,
              },
            },
            _count: {
              select: {
                invoice: {
                  where: {
                    paymentStatus: false,
                  },
                },
              },
            },
          },
        }),
      ]);

      return {
        contents: rentedRooms,
        totalElement: count,
      };
    },

    async hasRentedRoom(listingId) {
      return await db.rentedRoom.findFirst({
        where: {
          listingId,
          status: "CONFIRMER",
        },
      });
    },
  },
};

export default RentedRoomModel;
