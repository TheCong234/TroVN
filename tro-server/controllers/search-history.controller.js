import { BaseResponse } from "../responses/BaseResponse.js";
import SearchHistoryService from "../services/search-history.service.js";
import { statusCode } from "../config/statusCode.js";

const SearchHistoryController = {
  async findAll(req, res) {
    try {
      const { user } = req;
      const { page, limit } = req.query;
      const searchHistories = await SearchHistoryService.findAll(
        user.id,
        page,
        limit
      );
      return res
        .status(statusCode.OK)
        .json(BaseResponse.success("Thành công", searchHistories));
    } catch (error) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await SearchHistoryService.delete(id);
      return res
        .status(statusCode.NO_CONTENT)
        .json(BaseResponse.success("Thành công", null));
    } catch (error) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async deleteMany(req, res) {
    try {
      const { user } = req;
      await SearchHistoryService.deleteByUser(user?.id);
      return res
        .status(statusCode.NO_CONTENT)
        .json(BaseResponse.success("Thành công", null));
    } catch (error) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error(error.message, error));
    }
  },
};
export default SearchHistoryController;
