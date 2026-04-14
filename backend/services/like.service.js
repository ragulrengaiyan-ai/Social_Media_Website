import { ObjectId } from "mongodb";
import { client, MONGO_DATABASE } from "../index.js";

const createLike = async (data) => {
  try {
    const { postId, userId } = data;

    const existingLike = await client
      .db(MONGO_DATABASE)
      .collection("likes")
      .findOne({
        postId: new ObjectId(postId),
        userId,
      });

    if (existingLike) {
      return { alreadyLiked: true };
    }

    const result = await client
      .db(MONGO_DATABASE)
      .collection("likes")
      .insertOne({
        postId: new ObjectId(postId),
        userId,
        createdAt: new Date(),
      });

    return { acknowledged: result.acknowledged };
  } catch (err) {
    throw new Error(err.message);
  }
};

const removeLike = async (postId, userId) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection("likes")
      .deleteOne({
        postId: new ObjectId(postId),
        userId,
      });

    return result.deletedCount > 0;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getLikesCount = async (postId) => {
  try {
    return await client
      .db(MONGO_DATABASE)
      .collection("likes")
      .countDocuments({
        postId: new ObjectId(postId),
      });
  } catch (err) {
    throw new Error(err.message);
  }
};

export default { createLike, removeLike, getLikesCount };