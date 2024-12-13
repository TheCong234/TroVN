import ImageController from "../controllers/image.controller.js";
import express from "express";
import { upload } from "../config/multer.js";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/image", verifyTokenAllRole, ImageController.createImage);
router.delete("/image/:id", verifyTokenAllRole, ImageController.deleteImage);
router.post("/image/upload", verifyTokenAllRole, upload.single("file"), ImageController.uploadImage);
router.post("/image/upload-many", verifyTokenAllRole, upload.array("files"), ImageController.uploadManyImages);
router.delete(
  "/image/listing/:id",
  verifyTokenAllRole,
  ImageController.deleteImageByListingId
);

export default router;
