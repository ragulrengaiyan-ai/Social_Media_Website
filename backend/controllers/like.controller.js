import likeServices from "../services/like.service.js";
import { StatusCodes } from "http-status-codes";

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await likeServices.createLike({
      postId: id,
      userId: req.user.id,
    });

    if (result.alreadyLiked) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Already liked" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Liked successfully" });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await likeServices.removeLike(id, req.user.id);

    if (!status) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Like not found" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Unliked successfully" });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};