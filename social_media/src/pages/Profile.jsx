import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PostCard from '../components/PostCard';
import { FiGrid, FiList } from 'react-icons/fi';

const Profile = () => {
    const { user, updateUserSession } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');
    const [viewMode, setViewMode] = useState('grid');
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    
    // Edit Profile Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: "", bio: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        if (user?.id) {
            fetchUserPosts();
            fetchFollowStats();
        }
    }, [user]);

    const fetchFollowStats = async () => {
        try {
            const [followersRes, followingRes] = await Promise.all([
                api.getFollowers(user.id),
                api.getFollowing(user.id)
            ]);
            setFollowersCount(followersRes.count || 0);
            setFollowingCount(followingRes.count || 0);
        } catch (err) {
            console.error("Failed to fetch follow stats", err);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await api.get(`/posts/user/${user.id}`);
            const formattedPosts = (response.data || []).map(post => ({
                id: post._id,
                initials: post.authorName?.charAt(0) || "U",
                name: post.authorName || "Unknown User",
                handle: post.authorUsername ? `@${post.authorUsername}` : "@user",
                time: new Date(post.createdAt).toLocaleDateString(),
                avatarColor: "#" + Math.floor(Math.random()*16777215).toString(16),
                content: post.post_content,
                image: post.post_image || null,
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                isLiked: post.isLiked || false,
                shares: 0,
            }));
            setUserPosts(formattedPosts);
        } catch (err) {
            setError("Failed to load your posts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    const handleOpenEdit = () => {
        setEditData({ name: user?.name || "", bio: user?.bio || "" });
        setPreviewUrl(user?.profile_image || "");
        setIsEditModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append("name", editData.name);
            formData.append("bio", editData.bio);
            if (selectedFile) {
                formData.append("profile_image", selectedFile);
            }

            const response = await api.put("/users/profile", formData);
            if (response.success) {
                updateUserSession(response.data);
                setIsEditModalOpen(false);
                setSelectedFile(null);
            }
        } catch (err) {
            alert(err.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-info-section">
                    <div className="avatar-container">
                        <div className="profile-avatar">
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt={user.name} />
                            ) : (
                                user?.name?.charAt(0) || "U"
                            )}
                        </div>
                        <div className="edit-avatar-badge" onClick={handleOpenEdit}>✏️</div>
                    </div>

                    <h1 className="profile-name">{user?.name || 'User Name'}</h1>
                    <p className="profile-handle">
                        {user?.username ? `@${user.username}` : '@username'}
                    </p>

                    <p className="profile-bio">
                        {user?.bio || "No bio yet."}
                    </p>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-number">{userPosts.length}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{followersCount}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{followingCount}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn-edit-profile" onClick={handleOpenEdit}>Edit Profile</button>
                        <button className="btn-share-profile">Share Profile</button>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <div className="tabs-left">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                        onClick={() => setActiveTab('media')}
                    >
                        Media
                    </button>
                </div>
                
                <div className="view-selector">
                    <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <FiGrid />
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' && (
                    <>
                        {loading ? (
                            <div className="loading-state">Loading posts...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : userPosts.length === 0 ? (
                            <div className="empty-state">No posts yet</div>
                        ) : viewMode === 'list' ? (
                            <div className="posts-list">
                                {userPosts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="posts-grid">
                                {userPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        className="grid-post-item"
                                        onClick={() => handlePostClick(post)}
                                    >
                                        {post.image ? (
                                            <img src={post.image} alt="Post" />
                                        ) : (
                                            <div className="grid-post-text-preview">
                                                {post.content?.substring(0, 60)}...
                                            </div>
                                        )}
                                        <div className="grid-post-overlay">
                                            <div className="overlay-stat">
                                                <span>❤️ {post.likes}</span>
                                                <span>💬 {post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Post Detail Modal */}
            {isPostModalOpen && selectedPost && (
                <div className="post-detail-modal-overlay" onClick={() => setIsPostModalOpen(false)}>
                    <div className="post-detail-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-icon" onClick={() => setIsPostModalOpen(false)}>&times;</button>
                        <PostCard post={selectedPost} />
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="edit-form">
                            <div className="profile-avatar-edit">
                                <div className="avatar-preview">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" />
                                    ) : (
                                        <div className="avatar-initials">{editData.name?.charAt(0) || "U"}</div>
                                    )}
                                </div>
                                <button 
                                    type="button" 
                                    className="change-photo-btn"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change Profile Photo
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    value={editData.name} 
                                    onChange={e => setEditData({...editData, name: e.target.value})}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio</label>
                                <textarea 
                                    value={editData.bio} 
                                    onChange={e => setEditData({...editData, bio: e.target.value})}
                                    placeholder="Tell us about yourself..."
                                    rows="4"
                                />
                            </div>
                            <button type="submit" className="save-btn" disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
