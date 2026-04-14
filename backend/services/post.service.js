import { ObjectId } from "mongodb";
import { client, MONGO_DATABASE } from "../index.js";


const getAllPost = async (currentUserId) => {
  const safeUserId = currentUserId || "";
  return await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .aggregate([
      {
        $addFields: {
          user_id_obj: {
            $cond: [
              { $eq: [{ $type: "$userId" }, "objectId"] },
              "$userId",
              {
                $cond: [
                  { $regexMatch: { input: { $ifNull: ["$userId", ""] }, regex: "^[0-9a-fA-F]{24}$" } },
                  { $toObjectId: "$userId" },
                  null
                ]
              }
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
      // Aggregate Likes Count
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes"
        }
      },
      { $addFields: { likesCount: { $size: "$likes" } } },
      // Check if current user liked
      {
        $addFields: {
          isLiked: {
            $cond: [
              { $in: [safeUserId, "$likes.userId"] },
              true,
              false
            ]
          }
        }
      },
      // Aggregate Comments Count
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments"
        }
      },
      { $addFields: { commentsCount: { $size: "$comments" } } },
      {
        $project: {
          post_content: 1,
          post_image: 1,
          createdAt: 1,
          userId: 1,
          authorName: "$author.name",
          authorUsername: "$author.username",
          authorProfileImage: "$author.profile_image",
          likesCount: 1,
          commentsCount: 1,
          isLiked: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray();
};

const getPostsByUserId = async (userId, currentUserId) => {
  const safeUserId = currentUserId || "";
  return await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .aggregate([
      { $match: { userId: userId } },
      {
        $addFields: {
          user_id_obj: {
            $cond: [
              { $eq: [{ $type: "$userId" }, "objectId"] },
              "$userId",
              {
                $cond: [
                  { $regexMatch: { input: { $ifNull: ["$userId", ""] }, regex: "^[0-9a-fA-F]{24}$" } },
                  { $toObjectId: "$userId" },
                  null
                ]
              }
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
      // Aggregate Likes Count
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes"
        }
      },
      { $addFields: { likesCount: { $size: "$likes" } } },
      // Check if current user liked
      {
        $addFields: {
          isLiked: {
            $cond: [
              { $in: [safeUserId, "$likes.userId"] },
              true,
              false
            ]
          }
        }
      },
      // Aggregate Comments Count
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments"
        }
      },
      { $addFields: { commentsCount: { $size: "$comments" } } },
      {
        $project: {
          post_content: 1,
          post_image: 1,
          createdAt: 1,
          userId: 1,
          authorName: "$author.name",
          authorUsername: "$author.username",
          authorProfileImage: "$author.profile_image",
          likesCount: 1,
          commentsCount: 1,
          isLiked: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ])
    .toArray();
};

const getPostById = async (id) => {
  return await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .findOne({ _id: new ObjectId(id) });
};

const createPost = async (data, userId) => {
  const postData = data || {};
  const { post_content, post_image } = postData;

  if (!post_content && !post_image) {
    throw new Error("Post must have content or image");
  }

  return await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .insertOne({
      post_content: post_content || "",
      post_image: post_image || null,
      userId: userId,
      createdAt: new Date(),
    });
};

const updatePost = async (id, data, userId) => {
  const postData = data || {};
  const { post_content, post_image } = postData;
  
  const updateFields = {};
  if (post_content !== undefined) updateFields.post_content = post_content;
  if (post_image !== undefined) updateFields.post_image = post_image;

  const result = await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .updateOne(
      { _id: new ObjectId(id), userId: userId },
      {
        $set: {
          ...updateFields,
          updatedAt: new Date(),
        },
      }
    );

  return result.matchedCount > 0;
};

const deletePost = async (id, userId) => {
  const result = await client
    .db(MONGO_DATABASE)
    .collection("posts")
    .deleteOne({ _id: new ObjectId(id), userId: userId });

  return result.deletedCount > 0;
};

const getTrendingTags = async (limit = 6) => {
  // Simple mock: in a real app, you'd aggregate all hashtags from posts
  return [
    "#MERN", "#AITools", "#WebDev", "#JavaScript", "#ReactJS", "#NodeJS", 
    "#FullStack", "#AI", "#CodingLife", "#TechTrends"
  ].slice(0, limit);
};

const generateAICaption = async (prompt) => {
  // Simple mock: returns a caption based on simple logic
  const captions = [
    `Building the future with ${prompt || 'tech'}! 🚀 #Innovation #AI`,
    `Just finished a major update on my ${prompt || 'project'}. Check it out! 💻 #DevLife`,
    `Refining the workflow with some new ${prompt || 'tools'}. 🛠️ #Coding`,
    `Exploring the intersection of AI and social media. Let's talk ${prompt || 'trends'}! 🤖 #FutureTech`
  ];
  return {
    caption: captions[Math.floor(Math.random() * captions.length)],
    hashtags: "#AI #Tech #WebDev #Innovation"
  };
};

const postServices = {
  getAllPost,
  getPostsByUserId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getTrendingTags,
  generateAICaption,
};

export default postServices;