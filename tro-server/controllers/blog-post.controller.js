import { BaseResponse } from "../responses/BaseResponse.js";
import BlogPostService from "../services/blog-post.service.js";
import BlogTagService from "../services/blog-tag.service.js";
import SearchHistoryService from "../services/search-history.service.js";
import { statusCode } from "../config/statusCode.js";

const BlogPostController = {
  async create(req, res) {
    try {
      const { user } = req;
      let data = {
        ...req.body,
        authorId: user.id,
      };
      const post = await BlogPostService.create(data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", post));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async findAll(req, res) {
    try {
      const { page, limit, keyword, tag } = req.query;
      const posts = await BlogPostService.findAll(keyword, tag, page, limit);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", posts));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async update(req, res) {
    try {
      const data = req.body;
      const { id } = req.params;
      const post = await BlogPostService.update(data, id);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", post));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const posts = await BlogPostService.delete(id);
      return res
        .status(statusCode.NO_CONTENT)
        .json(BaseResponse.success("Thành công", posts));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async findOne(req, res) {
    try {
      const { slug } = req.params;
      const post = await BlogPostService.findOne(slug);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", post));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
};
export default BlogPostController;
