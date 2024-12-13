import {
  verifyTokenAllRole,
  verifyTokenWithUserPremium,
} from "../middlewares/auth.middleware.js";

import BannerController from "../controllers/banner.controller.js";
import express from "express";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/banner",
  verifyTokenAllRole,
  upload.single("file"),
  BannerController.createBanners
);

router.get("/banners", BannerController.getBanners);
router.get("/banners/active", BannerController.getBannersActive);
router.patch('/banners/:bannerId/block', BannerController.blockBanner);
router.get(
  "/banners/user",
  verifyTokenAllRole,
  BannerController.getBannersByUser
);

// router.delete(
//   "/favorite/:id",
//   verifyTokenAllRole,
//   FavoriteController.deleteFavorite
// );

export default router;
