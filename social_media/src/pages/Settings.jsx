import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FiUser, FiLock, FiEye, FiTrash2, FiChevronRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('account');
    
    // Password Change State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const sections = [
        { id: 'account', label: 'Account', icon: <FiUser /> },
        { id: 'security', label: 'Security', icon: <FiLock /> },
        { id: 'privacy', label: 'Privacy', icon: <FiEye /> },
    ];

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatus({ ...status, error: "New passwords do not match" });
            return;
        }

        setStatus({ loading: true, error: '', success: '' });
        try {
            await api.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setStatus({ loading: false, error: '', success: 'Password updated successfully!' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setStatus({ ...status, success: '' });
            }, 2000);
        } catch (err) {
            setStatus({ loading: false, error: err.message || 'Failed to update password', success: '' });
        }
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'account':
                return (
                    <div className="settings-section-content">
                        <h3>Account Information</h3>
                        <div className="settings-card">
                            <div className="info-row">
                                <span className="info-label">Display Name</span>
                                <span className="info-value">{user?.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Username</span>
                                <span className="info-value">@{user?.username}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{user?.email}</span>
                            </div>
                        </div>
                        <p className="helper-text">To change your basic profile info, visit your Profile page.</p>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-section-content">
                        <h3>Security & Password</h3>
                        <div className="settings-card">
                            <button className="settings-action-btn" onClick={() => setIsPasswordModalOpen(true)}>
                                <FiLock />
                                <span>Change Password</span>
                                <FiChevronRight className="chevron" />
                            </button>
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="settings-section-content">
                        <h3>Privacy Settings</h3>
                        <div className="settings-card">
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-label">Private Account</span>
                                    <span className="toggle-desc">Only followers can see your posts.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-label">Show Online Status</span>
                                    <span className="toggle-desc">Let others know when you are active.</span>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account preferences and security.</p>
            </header>

            <div className="settings-layout">
                <nav className="settings-sidebar">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <span className="icon">{section.icon}</span>
                            <span className="label">{section.label}</span>
                        </button>
                    ))}
                    
                    <div className="divider"></div>
                    
                    <button className="settings-nav-item danger" onClick={logout}>
                        <FiTrash2 />
                        <span>Log Out</span>
                    </button>
                </nav>

                <main className="settings-content">
                    {renderSectionContent()}
                    
                    <div className="danger-zone">
                        <h4>Danger Zone</h4>
                        <div className="danger-card">
                            <div className="danger-info">
                                <h5>Deactivate Account</h5>
                                <p>Temporarily disable your profile and posts.</p>
                            </div>
                            <button className="btn-outline-danger">Deactivate</button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
                    <div className="edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Change Password</h2>
                            <button className="close-btn" onClick={() => setIsPasswordModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="edit-form">
                            {status.error && (
                                <div className="settings-alert error">
                                    <FiAlertCircle /> {status.error}
                                </div>
                            )}
                            {status.success && (
                                <div className="settings-alert success">
                                    <FiCheckCircle /> {status.success}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Current Password</label>
                                <input 
                                    type="password" 
                                    value={passwordData.oldPassword} 
                                    onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                    required
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    value={passwordData.newPassword} 
                                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    required
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={passwordData.confirmPassword} 
                                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    required
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button type="submit" className="save-btn" disabled={status.loading}>
                                {status.loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
