import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage for Posts
const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social_media_posts",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov"],
    resource_type: "auto",
  },
});

// Configure Storage for Profile Pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
  },
});

const uploadPosts = multer({ storage: postStorage });
const uploadProfile = multer({ storage: profileStorage });

// Backward compatibility (export 'upload' as post upload)
const upload = uploadPosts;

export { cloudinary, upload, uploadPosts, uploadProfile };
