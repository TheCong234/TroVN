import db from "../lib/db.js";

const SearchHistory = {
  methods: {
    async create(data) {
      return await db.searchHistory.create({ data });
    },

    async findAll(userId, page = 1, limit = 8) {
      const skip = (page - 1) * limit;
      return await db.searchHistory.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    },

    async findAllContent(userId) {
      return await db.searchHistory.findMany({
        where: {
          userId,
        },
        select: {
          content: true,
        },
      });
    },

    async delete(id) {
      return await db.searchHistory.delete({
        where: {
          id,
        },
      });
    },

    async deleteByUser(userId) {
      return await db.searchHistory.deleteMany({ where: { userId } });
    },
  },
};

export default SearchHistory;
