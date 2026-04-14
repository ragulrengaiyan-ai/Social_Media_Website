import { ObjectId } from "mongodb";
import { client, MONGO_DATABASE } from "../index.js";

const createComment = async (postId, userId, comment) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection("comments")
      .insertOne({
        postId: new ObjectId(postId),
        userId: userId,
        comment: comment,
        createdAt: new Date(),
      });

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCommentsByPostId = async (postId) => {
  try {
    const comments = await client
      .db(MONGO_DATABASE)
      .collection("comments")
      .aggregate([
        { $match: { postId: new ObjectId(postId) } },
        {
          $addFields: {
            user_id_obj: {
              $cond: [
                { $regexMatch: { input: { $ifNull: ["$userId", ""] }, regex: /^[0-9a-fA-F]{24}$/ } },
                { $toObjectId: "$userId" },
                null
              ]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id_obj",
            foreignField: "_id",
            as: "author"
          }
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            comment: 1,
            createdAt: 1,
            userId: 1,
            authorName: "$author.name",
            authorUsername: "$author.username",
            authorProfileImage: "$author.profile_image"
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    return comments;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteComment = async (commentId, userId) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection("comments")
      .deleteOne({
        _id: new ObjectId(commentId),
        userId: userId,
      });

    return result.deletedCount > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

const commentServices = {
  createComment,
  getCommentsByPostId,
  deleteComment,
};

export default commentServices;