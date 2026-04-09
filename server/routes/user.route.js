import express from "express";
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getTotalUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/allusers", verifyToken, getAllUsers);
router.get("/total/users", verifyToken, getTotalUsers);
router.get("/:id", verifyToken, getUser);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
