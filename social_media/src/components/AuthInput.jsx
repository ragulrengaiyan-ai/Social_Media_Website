import React from "react";
import "../layouts/AuthLayout.css";

const AuthInput = ({ label, type = "text", placeholder, value, onChange }) => {
    return (
        <div className="auth-form-group">
            <label className="auth-label">{label}</label>
            <input
                type={type}
                className="auth-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default AuthInput;
