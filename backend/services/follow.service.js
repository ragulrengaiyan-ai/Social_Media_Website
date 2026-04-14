import { ObjectId } from "mongodb";
import { client, MONGO_DATABASE } from "../index.js";

const getFollowers = async (userId) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("follows")
    .find({ followingId: new ObjectId(userId) })
    .toArray();
};

const getFollowing = async (userId) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("follows")
    .find({ followerId: new ObjectId(userId) })
    .toArray();
};

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await client
    .db(MONGO_DATABASE)
    .collection("follows")
    .findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

  if (existing) {
    throw new Error("Already following this user");
  }

  return await client
    .db(MONGO_DATABASE)
    .collection("follows")
    .insertOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
    });
};

const unfollowUser = async (followerId, followingId) => {
  const result = await client
    .db(MONGO_DATABASE)
    .collection("follows")
    .deleteOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

  return result.deletedCount > 0;
};

export default {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};