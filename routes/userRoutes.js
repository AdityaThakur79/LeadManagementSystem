import {
  registerController,
  loginContoller,
  logoutController,
  getUserProfileController,
  updateUserController,
  forgotController,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  fetchUserById,
  getSupportAgents,
} from "../controllers/userController.js";
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginContoller);
router.post("/forgotpassword", forgotController);
router.get("/logout", logoutController);
router.get("/profile", isAuthenticated, getUserProfileController);
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateUserController
);
router.post("/create", isAuthenticated, createUser);
router.get("/", isAuthenticated, getAllUsers);
router.put("/:id", isAuthenticated, updateUser);
router.delete("/:id", isAuthenticated, deleteUser);
// router.get('/:id', fetchUserById);
router.get("/support-agents", getSupportAgents);


export default router;
