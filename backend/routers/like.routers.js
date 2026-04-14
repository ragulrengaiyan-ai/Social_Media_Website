import express from "express";
import { likePost, unlikePost } from "../controllers/like.controller.js";
import verifyToken from "../middleware/jwt.middleware.js";

const likeRouters = express.Router();

likeRouters.post("/:id/like", verifyToken, likePost);
likeRouters.delete("/:id/unlike", verifyToken, unlikePost);

export default likeRouters;