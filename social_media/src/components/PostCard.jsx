import React, { useState, useEffect } from "react";
import { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiSend } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { api } from "../services/api";
import "./PostCard.css";

function PostCard({ post }) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLikeToggle = async () => {
        const previousLiked = isLiked;
        const previousCount = likesCount;

        // Optimistic UI update
        setIsLiked(!previousLiked);
        setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

        try {
            if (previousLiked) {
                await api.unlikePost(post.id || post._id);
            } else {
                await api.likePost(post.id || post._id);
            }
        } catch (err) {
            // Revert on error
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
            console.error("Like action failed", err);
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    const fetchComments = async () => {
        try {
            const data = await api.getComments(post.id || post._id);
            setComments(data || []);
        } catch (err) {
            console.error("Failed to fetch comments", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.addComment(post.id || post._id, newComment);
            setNewComment("");
            fetchComments(); // Refresh comments list
            // Update comments count locally if needed (currently post.comments is static)
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-user">
                    <div className="post-avatar" style={{ backgroundColor: post.avatarColor }}>
                        {post.authorProfileImage ? (
                            <img src={post.authorProfileImage} alt={post.name} className="post-avatar-img" />
                        ) : (
                            post.initials
                        )}
                    </div>
                    <div className="post-user-info">
                        <span className="post-user-name">{post.name}</span>
                        <span className="post-user-handle">{post.handle}</span>
                    </div>
                </div>
                <div className="post-meta">
                    <span className="post-time">{post.time}</span>
                    <FiMoreHorizontal className="post-more" />
                </div>
            </div>

            <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                    <div className="post-image-container">
                        {post.image.match(/\.(mp4|webm|mov|ogg)$/i) || post.image.includes("/video/upload/") ? (
                            <video src={post.image} controls className="post-video" />
                        ) : (
                            <img src={post.image} alt="Post content" className="post-image" />
                        )}
                    </div>
                )}
            </div>

            <div className="post-footer">
                <div className="post-actions">
                    <div className={`post-action ${isLiked ? 'liked' : ''}`} onClick={handleLikeToggle}>
                        <FiHeart className={`action-icon heart ${isLiked ? 'filled' : ''}`} fill={isLiked ? "currentColor" : "none"} />
                        <span>{likesCount}</span>
                    </div>
                    <div className="post-action" onClick={toggleComments}>
                        <FiMessageCircle className="action-icon" />
                        <span>{post.comments}</span>
                    </div>
                    <div className="post-action">
                        <FiShare2 className="action-icon" />
                        <span>{post.shares}</span>
                    </div>
                </div>
                <button className="ai-caption-btn">
                    <LuSparkles className="ai-icon" />
                    <span>AI Caption</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map((c, i) => (
                                <div key={i} className="comment-item">
                                    <span className="comment-user">@{c.authorUsername || c.authorName || 'user'}:</span>
                                    <span className="comment-text">{c.comment}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">No comments yet. Be the first!</p>
                        )}
                    </div>
                    <form className="comment-form" onSubmit={handleAddComment}>
                        <input 
                            type="text" 
                            placeholder="Add a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" disabled={isSubmitting}>
                            <FiSend />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PostCard;
