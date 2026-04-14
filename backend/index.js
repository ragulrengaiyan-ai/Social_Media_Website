import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import http from "http";
import postsRouters from "./routers/post.routers.js";
import likeRouters from "./routers/like.routers.js";
import commentRouters from "./routers/comment.routers.js";
import userRouters from "./routers/user.routers.js";
import followRouters from "./routers/follow.routers.js"
import feedRouters from "./routers/feed.routers.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error(" \u274C CRITICAL ERROR: MONGO_URL is not defined in .env file");
  process.exit(1);
}

export const client = new MongoClient(MONGO_URL);

async function connectToDatabase() {
  try {
    console.log(" ⏳ Connecting to MongoDB...");
    await client.connect();
    console.log(" ✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error(" ❌ MongoDB Connection Error:");
    console.error(" Message:", err.message);
    if (err.message.includes("alert internal error") || err.message.includes("SSL alert number 80")) {
      console.log("\n 💡 TIP: This is likely an IP Whitelist issue. Double-check your MongoDB Atlas 'Network Access' settings!");
    }
    console.error(" Code:", err.code);
    console.error(" Detailed Error:", err);
  }
}

connectToDatabase();

app.use(express.json());
app.use(cors()); // Allow all origins for easier deployment

app.use("/users", userRouters);
app.use("/posts", postsRouters);
app.use("/posts", likeRouters);
app.use("/comments", commentRouters);
app.use("/follow",followRouters)
app.use("/feed",feedRouters)

export const MONGO_DATABASE = process.env.MONGO_DATABASE;

app.get("/", (req, res) => {
  res.send({ message: "Welcome to express.js server" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Only start the server if not running as a serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
}

export default app;
