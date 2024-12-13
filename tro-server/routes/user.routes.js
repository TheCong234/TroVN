import UserController from "../controllers/user.controller.js";
import { accessLogger } from "../middlewares/logger.middleware.js";
import express from "express";
import { upload } from "../config/multer.js";
import { verifyTokenAllRole } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/user/refresh-token", UserController.refreshToken);
router.get("/user/otp", verifyTokenAllRole, UserController.getUserOtp);
router.post("/user/verify", UserController.verifyEmail);
router.post("/user/zalo/:id", UserController.getUserByZaloId);
router.get("/user/balance", verifyTokenAllRole, UserController.getBalance);
router.get("/user/:id", UserController.getUser);
router.get("/user", verifyTokenAllRole, UserController.getCurrentUser);
router.get("/user/email/:email", UserController.getUserByEmail);
router.get("/users", verifyTokenAllRole, UserController.getAllUsers);

router.post("/user", UserController.createUser);
router.post("/user/login", accessLogger, UserController.login);
router.post("/user/email/:email", UserController.sendEmail);
router.put("/user/:id/forgot", UserController.changePassword);
router.put("/user/:id", UserController.updateUser);
router.put(
  "/user/avatar/:id",
  upload.single("file"),
  UserController.updateUserAvatar
);
router.delete("/user/:id", UserController.deleteUser);

export default router;
