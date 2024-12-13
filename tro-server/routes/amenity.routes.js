import AmenityController from "../controllers/amenity.controller.js";
import express from "express";
import { upload } from "../config/multer.js";
import { verifyTokenWithAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/amenities", AmenityController.getAllAmenity);
router.post(
  "/amenity",
  verifyTokenWithAdmin,
  AmenityController.createAmenity
);
router.put(
  "/amenity/:id",
  verifyTokenWithAdmin,
  AmenityController.updateAmenity
);
router.delete(
  "/amenity/:id",
  verifyTokenWithAdmin,
  AmenityController.deleteAmenity
);

export default router;
