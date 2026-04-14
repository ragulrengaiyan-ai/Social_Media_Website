import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import PostCard from "../components/PostCard";
import RightSidebar from "../components/RightSidebar";
import CreatePostModal from "../components/CreatePostModal";
import { api } from "../services/api";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      // Map backend fields to frontend component expectations if necessary
      const formattedPosts = (response.data || []).map(post => ({
        id: post._id,
        initials: post.authorName?.charAt(0) || "U",
        name: post.authorName || "Unknown User",
        handle: post.authorUsername ? `@${post.authorUsername}` : "@user",
        time: new Date(post.createdAt).toLocaleDateString(),
        avatarColor: "#" + Math.floor(Math.random()*16777215).toString(16),
        content: post.post_content,
        image: post.post_image || null,
        authorProfileImage: post.authorProfileImage || null,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        isLiked: post.isLiked || false,
        shares: 0,
      }));
      setPosts(formattedPosts);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="feed-container">
        <header className="feed-header">
          <h1 className="feed-title">Your Feed</h1>
          <button className="create-post-btn" onClick={() => setIsModalOpen(true)}>+ Create Post</button>
        </header>

        <CreatePostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onPostCreated={fetchPosts} 
        />

        <div className="posts-list">
          {loading ? (
            <div className="loading-state">Loading your feed...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No posts to show yet. Be the first to post!</div>
          ) : (
            posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

export default Dashboard;
