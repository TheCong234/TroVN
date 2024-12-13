import { VerifySignature } from "zmp-openapi-nodejs";
import { logger } from "../config/winston.js";

class ZaloWebhook {
  revokeConsent(req, res) {
    const secret = process.env.ZALO_MINI_APP_SECRET_KEY;

    const expectedSignature = VerifySignature.generateSignature(
      req.body,
      secret
    );
    const signature = req.headers["x-zevent-signature"];


    if (expectedSignature !== signature) {
      return res.status(401).send("Unauthorized");
    }

    const { event, appId, userId, timestamp } = req.body;

    if (event === "user.revoke.consent") {
      logger.info(
        `User ${userId} đã thu hồi quyền truy cập từ Mini App ${appId} vào lúc ${new Date(
          timestamp
        ).toISOString()}`
      );

      // Thực hiện các hành động khác (cập nhật database, thông báo, v.v.)
    }

    res.status(200).send("Webhook received");
  }
}

export default new ZaloWebhook();
