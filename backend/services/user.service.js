import { ObjectId } from "mongodb";
import { client, MONGO_DATABASE } from "../index.js";


const createUser = async (userData) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("users")
    .insertOne({
      ...userData,
      createdAt: new Date(),
    });
};

const getUserByEmail = async (email) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("users")
    .findOne({ email });
};

const getUserByUsername = async (username) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("users")
    .findOne({ username });
};

const getSuggestedUsers = async (excludeUserId, limit = 3) => {
  let excludedIds = [];
  if (excludeUserId && ObjectId.isValid(excludeUserId)) {
    excludedIds.push(new ObjectId(excludeUserId));
    
    // Also fetch users already followed by this user
    const following = await client
      .db(MONGO_DATABASE)
      .collection("follows")
      .find({ followerId: new ObjectId(excludeUserId) })
      .toArray();
    
    const followedIds = following.map(f => f.followingId);
    excludedIds = [...excludedIds, ...followedIds];
  }

  const query = excludedIds.length > 0 ? { _id: { $nin: excludedIds } } : {};

  return await client
    .db(MONGO_DATABASE)
    .collection("users")
    .find(query)
    .limit(limit)
    .toArray();
};

const updateUser = async (userId, data) => {
  const { name, bio, profile_image } = data;
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (bio !== undefined) updateFields.bio = bio;
  if (profile_image !== undefined) updateFields.profile_image = profile_image;

  const result = await client
    .db(MONGO_DATABASE)
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    );
  
  return result.matchedCount > 0;
};

const updatePassword = async (userId, hashedPassword) => {
  const result = await client
    .db(MONGO_DATABASE)
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
  return result.matchedCount > 0;
};

const userServices = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getSuggestedUsers,
  updateUser,
  updatePassword
};

export default userServices;
