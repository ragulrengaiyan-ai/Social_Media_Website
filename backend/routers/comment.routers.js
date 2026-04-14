import express from "express";
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { commentSchema } from "../schemas/comment.schema.js";
import { validateSchema } from "../middleware/validate.schema.js";
import verifyToken from "../middleware/jwt.middleware.js";

const commentRouters = express.Router();

commentRouters.get("/:id", getCommentsByPostId);
commentRouters.post("/:id", verifyToken, validateSchema(commentSchema), createComment);
commentRouters.delete("/:id", verifyToken, deleteComment);

export default commentRouters;