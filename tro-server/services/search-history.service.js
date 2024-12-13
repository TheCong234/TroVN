import SearchHistory from "../models/search-history.model.js";
import { logger } from "../config/winston.js";
import redisClient from "../config/redis.client.config.js";

const USE_REDIS_CACHE = process.env.USE_REDIS_CACHE === "true";

const SearchHistoryService = {
  async create(data) {
    try {
      const result = await SearchHistory.methods.create(data);

      if (USE_REDIS_CACHE) {
        const cacheKey = `recommendations:${data.userId}`;
        try {
          await redisClient.del(cacheKey);
          logger.info(
            `Cache cleared for recommendations of user: ${data.userId}`
          );
        } catch (redisError) {
          logger.warn("Failed to clear cache:", redisError);
        }
      }

      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAll(userId, page, limit) {
    try {
      return await SearchHistory.methods.findAll(userId, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findAllContent(userId) {
    try {
      return await SearchHistory.methods.findAllContent(userId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await SearchHistory.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async deleteByUser(userId) {
    try {
      return await SearchHistory.methods.deleteByUser(userId);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default SearchHistoryService;
