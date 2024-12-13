import {
  verifyTokenAllRole,
  verifyTokenOptional,
} from "../middlewares/auth.middleware.js";

import ListingController from "../controllers/listing.controller.js";
import ListingTagController from "../controllers/listingTag.controller.js";
import express from "express";
import { upload } from "../config/multer.js";

const router = express.Router();

router.post(
  "/listing",
  // upload.array("files"),
  verifyTokenAllRole,
  ListingController.createListing
);

router.get(
  "/listing/:id",
  verifyTokenOptional,
  ListingController.getListingById
);
router.get("/listings", verifyTokenOptional, ListingController.getListings);
router.get(
  "/listings/recommendations",
  verifyTokenAllRole,
  ListingController.getRecommendations
);
router.get(
  "/listing/user/:id",
  verifyTokenOptional,
  ListingController.getListingByUserId
);
router.get(
  "/listings/for-user",
  verifyTokenOptional,
  ListingController.getNearbyListings
);
router.get(
  "/listings/get/json",
  verifyTokenOptional,
  ListingController.getListingsToGeoJSON
);
router.put("/listing/:id", verifyTokenAllRole, ListingController.updateListing);

router.post("/listing/:id/listingTag", ListingTagController.createListingTag);

export default router;
