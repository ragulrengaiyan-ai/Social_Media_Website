import commentServices from "../services/comment.service.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const result = await commentServices.createComment(
      id,
      req.user.id,
      comment
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Comment added",
      id: result.insertedId,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await commentServices.getCommentsByPostId(id);

    return res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const status = await commentServices.deleteComment(id, req.user.id);

    if (!status) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `Comment not found or not authorized`,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: err.message,
    });
  }
};

