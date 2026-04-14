import express from "express";
import {
  getAllPosts,
  getPostsByUser,
  getPostById,
  createPost,
  updatePostById,
  deletePostById,
  getTrendingTags,
  generateAICaption,
} from "../controllers/post.controller.js";

import verifyToken from "../middleware/jwt.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/trending", getTrendingTags);
router.post("/generate-caption", verifyToken, generateAICaption);
router.get("/user/:userId", verifyToken, getPostsByUser);
router.get("/:id", getPostById);
router.post("/", verifyToken, upload.single("post_image"), validateSchema(createPostSchema), createPost);
router.put("/:id", verifyToken, updatePostById);
router.delete("/:id", verifyToken, deletePostById);

export default router;