import { BaseResponse } from "../responses/BaseResponse.js";
import BlogTagService from "../services/blog-tag.service.js";
import SearchHistoryService from "../services/search-history.service.js";
import { statusCode } from "../config/statusCode.js";

const BlogTagController = {
  async create(req, res) {
    try {
      let data = req.body;
      const blogTag = await BlogTagService.create(data);
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", blogTag));
    } catch (error) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error(error.message, error));
    }
  },
};
export default BlogTagController;
