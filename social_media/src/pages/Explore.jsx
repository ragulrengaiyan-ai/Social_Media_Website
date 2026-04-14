import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { api } from '../services/api';
import './Explore.css';

const categories = [
  { id: 1, name: '#Photography', posts: '2.4K posts', emoji: '📸' },
  { id: 2, name: '#Design', posts: '3.6K posts', emoji: '🎨' },
  { id: 3, name: '#Startups', posts: '1.9K posts', emoji: '🚀' },
  { id: 4, name: '#TechTalk', posts: '8.1K posts', emoji: '💻' },
  { id: 5, name: '#Music', posts: '5.2K posts', emoji: '🎵' },
  { id: 6, name: '#AITrends', posts: '12K posts', emoji: '🤖' },
];

function Explore() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getSuggestedUsers();
        if (response.success) {
          const formattedUsers = response.data.map(user => ({
            ...user,
            initials: user.name?.charAt(0) || "U",
            handle: `@${user.username}`,
            colorClass: ['bg-coral', 'bg-sky', 'bg-violet', 'bg-emerald'][Math.floor(Math.random() * 4)]
          }));
          setSuggestedUsers(formattedUsers);
        }
      } catch (err) {
        console.error("Failed to fetch suggested users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleFollowToggle = async (targetId, isFollowing) => {
    try {
      if (isFollowing) {
        await api.unfollowUser(targetId);
      } else {
        await api.followUser(targetId);
      }

      setSuggestedUsers(prev => prev.map(u =>
        (u._id === targetId || u.id === targetId) ? { ...u, isFollowing: !isFollowing } : u
      ));
    } catch (err) {
      console.error("Follow action failed", err);
    }
  };

  return (
    <div className="explore-container">
      <header className="explore-header">
        <h1 className="explore-title">Explore</h1>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users, posts, hashtags..."
            className="search-input"
          />
        </div>
      </header>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <div className="category-icon">{cat.emoji}</div>
            <h3 className="category-name">{cat.name}</h3>
            <span className="category-posts">{cat.posts}</span>
          </div>
        ))}
      </div>

      <section className="suggested-users">
        <div className="section-header">
          <h2 className="section-title">Suggested Users</h2>
        </div>
        <div className="users-grid">
          {suggestedUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className={`user-avatar ${user.colorClass}`}>
                {user.initials}
              </div>
              <div className="user-details">
                <span className="u-name">{user.name}</span>
                <span className="u-handle">{user.handle}</span>
              </div>
              <p className="user-bio">{user.bio}</p>
              <button
                className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollowToggle(user._id || user.id, user.isFollowing)}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Explore;
