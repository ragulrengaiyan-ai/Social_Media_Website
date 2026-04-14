import React, { useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import { api } from '../services/api';
import './AITools.css';

const AITools = () => {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a description or keywords");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            const response = await api.generateAICaption(prompt);
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.message || "Failed to generate caption");
            }
        } catch (err) {
            setError(err.message || "An error occurred during generation");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        const textToCopy = `${result.caption}\n\n${result.hashtags}`;
        navigator.clipboard.writeText(textToCopy);
        alert("Copied to clipboard!");
    };

    return (
        <div className="ai-tools-container">
            <div className="ai-tools-header">
                <h1>AI Tools</h1>
                <button className="powered-by-btn">
                    POWERED BY AI ✨
                </button>
            </div>

            <div className="ai-tools-content">
                {/* Chatbot Card */}
                <FeatureCard
                    icon={<span className="robot-icon">🤖</span>}
                    iconClass="icon-box pink-icon"
                    title="AI Support Chatbot"
                    description="Get instant help 24/7 for any platform question"
                    className="ai-card chatbot-card"
                >

                    <div className="chat-area">
                        <div className="message system-message">
                            <span className="sparkle">✨</span> Hi! I'm SocioMedia AI. How can I help you today?
                        </div>

                        <div className="message-row right">
                            <div className="message user-message">
                                How do I reset my password?
                            </div>
                        </div>

                        <div className="message system-message text-response">
                            To reset your password: Go to Settings → Security → Change
                            Password. You'll receive a verification email. Check your inbox!
                        </div>

                        <div className="message-row right">
                            <div className="message user-message">
                                How do I make my profile private?
                            </div>
                        </div>
                    </div>
                </FeatureCard>

                {/* Generator Card */}
                <FeatureCard
                    icon={<span className="sparkle-icon">✨</span>}
                    iconClass="icon-box orange-icon"
                    title="Caption & Hashtag Generator"
                    description="Describe your post for AI-generated captions and hashtags"
                    className="ai-card generator-card"
                >
                    <textarea
                        className="description-input"
                        placeholder="Describe your post content here (e.g., 'coding on a Sunday morning')..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>

                    <button 
                        className="generate-btn" 
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? "✨ Generating..." : "✨ Generate Caption & Hashtags"}
                    </button>

                    {error && <p className="error-message" style={{color: 'var(--accent-pink)', marginTop: '10px'}}>{error}</p>}

                    {result && (
                        <div className="generated-result">
                            <div className="result-section">
                                <h3>GENERATED CAPTION:</h3>
                                <p>{result.caption}</p>
                            </div>

                            <div className="result-section">
                                <h3>HASHTAGS:</h3>
                                <p className="hashtags">{result.hashtags}</p>
                            </div>

                            <button className="copy-btn" onClick={handleCopy}>
                                <span className="copy-icon">📋</span> Copy All
                            </button>
                        </div>
                    )}
                </FeatureCard>
            </div>
        </div>
    );
};

export default AITools;
