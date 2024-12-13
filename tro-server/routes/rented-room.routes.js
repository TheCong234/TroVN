import express from "express";
import RentedRoomController from "../controllers/rented-room.controller.js";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/rented-rooms/host",
  verifyTokenAllRole,
  RentedRoomController.getByHost
);

router.get(
  "/rented-rooms/user",
  verifyTokenAllRole,
  RentedRoomController.getAllByUser
);

router.get(
  "/rented-rooms/:id",
  verifyTokenAllRole,
  RentedRoomController.getById
);

router.put(
  "/rented-rooms/:id",
  verifyTokenAllRole,
  RentedRoomController.updateRentedRoom
);

router.delete(
  "/rented-rooms/:id",
  verifyTokenAllRole,
  RentedRoomController.deleteRentedRoom
);
export default router;
