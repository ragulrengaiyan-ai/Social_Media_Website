import React from "react";
import "../layouts/AuthLayout.css";

const FeatureCard = ({ icon, iconClass, title, description, className = "", children }) => {
    const hasHeader = icon || title || description;

    return (
        <div className={`feature-card ${className}`}>
            {hasHeader && (
                <div className="feature-card-header">
                    {icon && <div className={`feature-icon ${iconClass}`}>{icon}</div>}
                    <div className="feature-info">
                        {title && <h4>{title}</h4>}
                        {description && <p>{description}</p>}
                    </div>
                </div>
            )}
            {children && <div className="feature-card-content">{children}</div>}
        </div>
    );
};

export default FeatureCard;
