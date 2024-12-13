import BlogPostModel from "../models/blog-post.model.js";
import BogTagModel from "../models/blog-tag.model.js";
import { logger } from "../config/winston.js";
import { toSlug } from "../utils/string.utils.js";

const BlogPostService = {
  async create(data) {
    try {
      const slug = toSlug(data?.title);
      const newData = {
        ...data,
        slug,
      };
      return await BlogPostModel.methods.create(newData);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async findAll(keyword, tag, page, limit) {
    try {
      return await BlogPostModel.methods.findAll(keyword, tag, page, limit);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
  async delete(id) {
    try {
      return await BlogPostModel.methods.delete(id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async update(data, id) {
    try {
      const slug = toSlug(data?.title);
      const newData = {
        ...data,
        slug,
      };
      return await BlogPostModel.methods.update(newData, id);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  async findOne(slug) {
    try {
      return await BlogPostModel.methods.findOne(slug);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

export default BlogPostService;
