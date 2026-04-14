import React, { useEffect, useState } from "react";
import { api } from "../services/api";

function RightSidebar() {
    const [whoToFollow, setWhoToFollow] = useState([]);
    const [trendingTags, setTrendingTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, tagsRes] = await Promise.all([
                    api.getSuggestedUsers(),
                    api.getTrendingTags()
                ]);
                
                if (usersRes.success) {
                    setWhoToFollow(usersRes.data.map(u => ({
                        ...u,
                        initials: u.name?.charAt(0) || "U",
                        handle: `@${u.username}`,
                        color: "#" + Math.floor(Math.random()*16777215).toString(16)
                    })));
                }
                
                if (tagsRes.success) {
                    setTrendingTags(tagsRes.data);
                }
            } catch (err) {
                console.error("Failed to fetch sidebar data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFollowToggle = async (targetId, isFollowing) => {
        try {
            if (isFollowing) {
                await api.unfollowUser(targetId);
            } else {
                await api.followUser(targetId);
            }
            
            // Update local state
            setWhoToFollow(prev => prev.map(u => 
                (u._id === targetId || u.id === targetId) ? { ...u, isFollowing: !isFollowing } : u
            ));
        } catch (err) {
            console.error("Follow action failed", err);
        }
    };

    return (
        <aside className="right-sidebar">
            <div className="sidebar-section">
                <h3 className="section-title">WHO TO FOLLOW</h3>
                <div className="follow-list">
                    {whoToFollow.map((user, index) => (
                        <div key={index} className="follow-item">
                            <div className="follow-avatar" style={{ backgroundColor: user.color }}>
                                {user.initials}
                            </div>
                            <div className="follow-info">
                                <span className="follow-name">{user.name}</span>
                                <span className="follow-handle">{user.handle}</span>
                            </div>
                            <button 
                                className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
                                onClick={() => handleFollowToggle(user._id || user.id, user.isFollowing)}
                            >
                                {user.isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="section-title">TRENDING TAGS</h3>
                <div className="tags-grid">
                    {trendingTags.map((tag, index) => (
                        <span key={index} className="tag-chip">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="sidebar-section ai-assistant-card">
                <h3 className="section-title">AI ASSISTANT</h3>
                <p className="ai-desc">Need help with your posts or profile? Ask me anything!</p>
                <button className="ai-tools-btn">Open AI Tools</button>
            </div>
        </aside>
    );
}

export default RightSidebar;
