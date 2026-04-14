import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { useAuth } from "../context/AuthContext";
import "../layouts/AuthLayout.css";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const name = `${firstName} ${lastName}`.trim();
        const formattedUsername = username.startsWith('@') ? username : `@${username}`;

        try {
            const result = await register(name, formattedUsername, email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message || "Registration failed");
            }
        } catch (err) {
            setError(err.message || "An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleRegister}>
            {error && <div className="auth-error" style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <AuthInput
                        label="First Name"
                        placeholder="Alex"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <AuthInput
                        label="Last Name"
                        placeholder="Nova"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>

            <AuthInput
                label="Username"
                placeholder="@alexnova"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account →"}
            </button>
        </form>
    );
};

export default Register;
