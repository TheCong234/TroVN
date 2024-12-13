import BlogPostModel from "../models/blog-post.model.js";
import BogTagModel from "../models/blog-tag.model.js";
import { logger } from "../config/winston.js";

const BlogTagService = {
  async create(data) {
    try {
      return await BogTagModel.methods.create(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async createMany(data) {
    try {
      return await BogTagModel.methods.createMany(data);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default BlogTagService;
