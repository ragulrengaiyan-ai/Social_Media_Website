import userServices from "../services/user.service.js";
import authHelper from "../helpers/auth.js";
import jwtHelper from "../helpers/jwt.helper.js";
import { StatusCodes } from "http-status-codes";

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUserByEmail = await userServices.getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Email already exists" });
    }

    const existingUserByUsername = await userServices.getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(StatusCodes.CONFLICT).json({ message: "Username already exists" });
    }

    const hashedPassword = await authHelper.genHashedPassword(password);

    const result = await userServices.createUser({
      name,
      username,
      email,
      password: hashedPassword
    });

    const token = jwtHelper.genToken({ id: result.insertedId.toString(), email });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        id: result.insertedId,
        name,
        username,
        email
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const isMatch = await authHelper.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = jwtHelper.genToken({ id: user._id.toString(), email: user.email });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const excludeUserId = req.user?.id; // req.user populated by auth middleware
    
    const users = await userServices.getSuggestedUsers(excludeUserId, limit);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      data: users.map(u => ({
        id: u._id,
        name: u.name,
        username: u.username,
        bio: u.bio || ""
      }))
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;
    const profileData = { name, bio };

    // If a profile picture was uploaded, add the URL
    if (req.file) {
      profileData.profile_image = req.file.path;
    }

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Name is required" });
    }

    const success = await userServices.updateUser(userId, profileData);

    if (!success) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    // Fetch updated user to return fresh data
    const updatedUser = await userServices.getUserByEmail(req.user.email);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio || "",
        profile_image: updatedUser.profile_image || null
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Both old and new passwords are required" });
    }

    const user = await userServices.getUserByEmail(req.user.email);
    const isMatch = await authHelper.comparePassword(oldPassword, user.password);

    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Incorrect old password" });
    }

    const hashedNewPassword = await authHelper.genHashedPassword(newPassword);
    await userServices.updatePassword(userId, hashedNewPassword);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};
