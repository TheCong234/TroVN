import moment from "moment";
import { logger } from "../config/winston.js";

export const appointmentTemplate = (fullUrl, data) => {
  const { address, title, id } = data?.listing;
  const { user } = data;
  const url = fullUrl + "appointment";
  logger.info(url);
  return `<!DOCTYPE html>
        <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Xác nhận lịch xem phòng</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header h2 {
                        margin: 0;
                        color: #333333;
                    }
                    .content {
                        line-height: 1.6;
                        color: #555555;
                    }
                    .content a {
                        color: #1a73e8;
                        text-decoration: none;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #1a73e8;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Xác nhận lịch xem phòng đã được duyệt</h2>
                    </div>
                    <div class="content">
                        <p>Kính gửi <strong>${
                          user?.fullName || user?.email
                        }</strong>,</p>
                        <p>Chúng tôi xin thông báo rằng lịch xem phòng của quý khách đã được duyệt thành công. Quý khách có thể xem chi tiết lịch hẹn tại liên kết dưới đây:</p>
                        <p><a href="${url}" class="button">Xem lịch xem phòng</a></p>
                        <p>Thông tin chi tiết về lịch xem phòng của quý khách:</p>
                        <ul>
                            <li><strong>Phòng:</strong> ${title}</li>
                            <li><strong>Ngày giờ:</strong>${moment(
                              data.appointmentDate
                            ).format("HH:mm  DD-MM-YYYY")}</li>
                            <li><strong>Địa chỉ:</strong>${address}</li>
                        </ul>
                        <p>Nếu có bất kỳ thay đổi hoặc câu hỏi nào, vui lòng liên hệ với chúng tôi qua <strong>${
                          data?.listing?.user?.phoneNumber ||
                          data?.listing?.user?.email
                        }</strong> để được hỗ trợ.</p>
                        <p>Chúng tôi rất mong được đón tiếp quý khách và hy vọng quý khách sẽ có một trải nghiệm tốt.</p>
                    </div>
                    <div class="footer">
                        <p>Trân trọng,<br>TROVN</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};
