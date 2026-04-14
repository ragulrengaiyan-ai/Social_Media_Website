import express from "express";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from "../controllers/follow.controller.js";

import verifyToken from "../middleware/jwt.middleware.js";

const router = express.Router();

router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.post("/follow", verifyToken, followUser);
router.delete("/unfollow/:followingId", verifyToken, unfollowUser);

export default router;