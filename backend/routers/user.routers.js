import express from "express";
import { register, login, getSuggestedUsers, updateProfile, changePassword } from "../controllers/user.controller.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";
import verifyToken from "../middleware/jwt.middleware.js";
import { uploadProfile } from "../middleware/upload.middleware.js";

const userRouters = express.Router();

userRouters.post("/register", validateSchema(registerSchema), register);
userRouters.post("/login", validateSchema(loginSchema), login);
userRouters.get("/suggested", verifyToken, getSuggestedUsers);
userRouters.put("/profile", verifyToken, uploadProfile.single("profile_image"), updateProfile);
userRouters.put("/change-password", verifyToken, changePassword);

export default userRouters;
