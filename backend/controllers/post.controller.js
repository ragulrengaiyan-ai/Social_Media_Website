import postServices from "../services/post.service.js";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postServices.getAllPost(req.user?.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid user ID",
      });
    }

    const posts = await postServices.getPostsByUserId(userId, req.user?.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid post ID",
      });
    }

    const post = await postServices.getPostById(id);

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: post,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

export const getTrendingTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const tags = await postServices.getTrendingTags(limit);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: tags
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message
    });
  }
};

export const generateAICaption = async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await postServices.generateAICaption(prompt);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const postData = { ...(req.body || {}) };
    
    // If a file was uploaded, use the Cloudinary URL
    if (req.file) {
      postData.post_image = req.file.path;
    }

    const result = await postServices.createPost(postData, req.user.id);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Post created successfully",
      data: {
        _id: result.insertedId,
        ...postData,
        userId: req.user.id
      },
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `[V2-FIX] ${err.message}`,
    });
  }
};

export const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid post ID",
      });
    }

    const updated = await postServices.updatePost(id, req.body, req.user.id);

    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Post updated successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid post ID",
      });
    }

    const deleted = await postServices.deletePost(id, req.user.id);

    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};