import React, { useState } from "react";
import { FiX, FiImage, FiSmile } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import "./CreatePostModal.css";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = React.useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setError("");
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onEmojiClick = (emojiData) => {
        setContent(prev => prev + emojiData.emoji);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !selectedFile) {
            setError("Post cannot be empty");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("post_content", content);
            if (selectedFile) {
                formData.append("post_image", selectedFile);
            }

            const response = await api.post("/posts", formData);

            if (response.success) {
                setContent("");
                handleRemoveFile();
                onPostCreated();
                onClose();
            } else {
                setError(response.message || "Failed to create post");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const isVideo = selectedFile?.type.startsWith("video/");

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Create Post</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="post-input-area">
                        <div className="user-avatar">{getInitials(user?.name)}</div>
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onClick={() => setShowEmojiPicker(false)}
                            autoFocus
                        ></textarea>
                    </div>

                    <input 
                        type="file" 
                        ref={fileInputRef}
                        style={{ display: 'none' }} 
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />

                    {previewUrl && (
                        <div className="image-preview">
                            {isVideo ? (
                                <video src={previewUrl} controls />
                            ) : (
                                <img src={previewUrl} alt="Preview" />
                            )}
                            <button type="button" className="remove-img" onClick={handleRemoveFile}>
                                <FiX />
                            </button>
                        </div>
                    )}

                    {error && <div className="modal-error">{error}</div>}

                    <footer className="modal-footer">
                        <div className="post-tools">
                            <button 
                                type="button" 
                                className={`tool-btn ${selectedFile ? 'active' : ''}`}
                                onClick={() => {
                                    fileInputRef.current?.click();
                                    setShowEmojiPicker(false);
                                }}
                                title="Add Photo/Video"
                            >
                                <FiImage />
                            </button>
                            <div className="emoji-tool-container">
                                <button 
                                    type="button" 
                                    className={`tool-btn ${showEmojiPicker ? 'active' : ''}`}
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    title="Add Emoji"
                                >
                                    <FiSmile />
                                </button>
                                {showEmojiPicker && (
                                    <div className="emoji-picker-container">
                                        <EmojiPicker 
                                            onEmojiClick={onEmojiClick}
                                            autoFocusSearch={false}
                                            theme="dark"
                                            width={300}
                                            height={400}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="post-submit-btn" 
                            disabled={loading || (!content.trim() && !selectedFile)}
                        >
                            {loading ? "Posting..." : "Post Now"}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
