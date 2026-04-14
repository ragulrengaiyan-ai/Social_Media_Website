import followServices from "../services/follow.service.js";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";


export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid userId" });
    }

    const followers = await followServices.getFollowers(userId);

    res.status(StatusCodes.OK).json({
      message: "Followers fetched successfully",
      count: followers.length,
      followers,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};


export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid userId" });
    }

    const following = await followServices.getFollowing(userId);

    res.status(StatusCodes.OK).json({
      message: "Following fetched successfully",
      count: following.length,
      following,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};


export const followUser = async (req, res) => {
  try {
    const { followingId } = req.body;
    const followerId = req.user.id;

    if (!followingId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "followingId required" });
    }

    const result = await followServices.followUser(
      followerId,
      followingId
    );

    res.status(StatusCodes.CREATED).json({
      message: "Followed successfully",
      data: result,
    });
  } catch (err) {
    if (err.message === "Already following this user") {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: err.message });
    }

    if (err.message === "You cannot follow yourself") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: err.message });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};


export const unfollowUser = async (req, res) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.id;

    if (!followingId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "followingId required" });
    }

    const success = await followServices.unfollowUser(
      followerId,
      followingId
    );

    if (!success) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Follow relationship not found" });
    }

    res.status(StatusCodes.OK).json({
      message: "Unfollowed successfully",
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};