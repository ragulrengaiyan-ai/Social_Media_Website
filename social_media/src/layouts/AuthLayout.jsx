import { Outlet, Link, useLocation } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import "./AuthLayout.css";

const AuthLayout = () => {
    const location = useLocation();
    const isSignIn = location.pathname === "/login" || location.pathname === "/signin";
    const isRegister = location.pathname === "/register";

    return (
        <div className="auth-container">
            {/* Left Auth Panel */}
            <aside className="auth-sidebar">
                <div className="auth-logo-container">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" className="nexus-n">
                                <path d="M6 5v14l4-3v-8l4 8v-14l-4 3v8l-4-8z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="auth-logo-text">SocioMedia</span>
                    </div>
                    <span className="auth-badge">AI SOCIAL</span>
                </div>

                <div className="auth-tabs">
                    <Link
                        to="/login"
                        className={`auth-tab ${isSignIn ? "active" : ""}`}
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className={`auth-tab ${isRegister ? "active" : ""}`}
                    >
                        Register
                    </Link>
                </div>

                <div className="auth-content">
                    <Outlet />
                </div>
            </aside>

            {/* Right Decorative Panel */}
            <main className="auth-hero">
                <div className="auth-hero-grid"></div>
                <div className="auth-feature-cards">
                    <FeatureCard
                        icon="🤖"
                        iconClass="icon-support"
                        title="AI Chatbot Support"
                        description="24/7 intelligent assistance"
                    />
                    <FeatureCard
                        icon="✨"
                        iconClass="icon-caption"
                        title="Caption Generator"
                        description="AI-powered content creation"
                    />
                    <FeatureCard
                        icon="🛡️"
                        iconClass="icon-moderation"
                        title="AI Moderation"
                        description="Safe community environment"
                    />
                    <FeatureCard
                        icon="📝"
                        iconClass="icon-bio"
                        title="Bio Generator"
                        description="Professional profile creation"
                    />
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
