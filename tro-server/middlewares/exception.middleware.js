import { statusCode } from "../config/statusCode.js";
import { BaseResponse } from "../responses/BaseResponse.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const message = err.message || "Có lỗi xảy ra! Vui lòng thử lại";
  const status = err.status || statusCode.INTERNAL_SERVER_ERROR;

  return res.status(status).json(BaseResponse.error(message, null));
};

export default errorHandler;
