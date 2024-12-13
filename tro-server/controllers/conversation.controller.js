import { BaseResponse } from "../responses/BaseResponse.js";
import ConversationService from "../services/conversation.service.js";
import { statusCode } from "../config/statusCode.js";

const ConversationController = {
  async getConversation(req, res) {
    const { id } = req.query;
    try {
      const conversation = await ConversationService.getConversation(id);
      if (conversation) {
        return res
          .status(statusCode.OK)
          .json(BaseResponse.success("Thành công", conversation));
      }
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error("Chưa có cuộc trò chuyện nào", []));
    } catch (error) {
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async updateConversation(req, res) {
    try {
      const { id } = req.params;
      const { user } = req;
      const data = req.body;
      const conversation = await ConversationService.updateConversation(
        id,
        data
      );
      return res
        .status(statusCode.NOT_FOUND)
        .json(BaseResponse.error("Cập nhật thành công", conversation));
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },

  async deleteConversation(req, res) {
    try {
      const { id } = req.params;
      const conversation = await ConversationService.deleteConversation(id);
      return res
        .status(statusCode.NOT_FOUND)
        .json(
          BaseResponse.error("Xoa cuoc tro chuyen thanh cong", conversation)
        );
    } catch (error) {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .json(BaseResponse.error(error.message, error));
    }
  },
};

export default ConversationController;
