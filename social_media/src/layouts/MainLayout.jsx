import {
    FiHome,
    FiCompass,
    FiBell,
    FiMail,
    FiLayers,
    FiUser,
    FiLogOut,
    FiSettings,
} from "react-icons/fi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MainLayout.css";

function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="app-container">
            <aside className="sidebar-aside">
                <div className="sidebar-logo">
                    <div className="logo-icon">SM</div>
                    <span className="logo-text">SocioMedia</span>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/dashboard" className={`nav-item ${isActive("/dashboard")}`}>
                        <FiHome className="nav-icon" />
                        <span className="nav-label">Feed</span>
                    </Link>
                    <Link to="/explore" className={`nav-item ${isActive("/explore")}`}>
                        <FiCompass className="nav-icon" />
                        <span className="nav-label">Explore</span>
                        {isActive("/explore") && <div className="active-indicator"></div>}
                    </Link>

                    <Link to="/ai-tools" className={`nav-item ${isActive("/ai-tools")}`}>
                        <FiLayers className="nav-icon" />
                        <span className="nav-label">AI Tools</span>
                        <span className="badge badge-purple">AI</span>
                    </Link>
                    <Link to="/profile" className={`nav-item ${isActive("/profile")}`}>
                        <FiUser className="nav-icon" />
                        <span className="nav-label">Profile</span>
                    </Link>
                    <Link to="/settings" className={`nav-item ${isActive("/settings")}`}>
                        <FiSettings className="nav-icon" />
                        <span className="nav-label">Settings</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="avatar">
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt={user.name} className="avatar-img" />
                            ) : (
                                getInitials(user?.name)
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || "User"}</span>
                            <span className="user-handle">@{user?.username || "username"}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn" title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
