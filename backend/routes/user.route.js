import express from "express";
import { deleteUser, getAllUsers, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/get_user/:id", verifyToken, getUser);
userRouter.get("/get_all_users", verifyToken, getAllUsers);
userRouter.delete("/delete_user/:id", verifyToken, deleteUser);

export { userRouter };
