import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaEnvelope, FaEnvelopeOpen, FaSearch, FaTimes } from 'react-icons/fa';
import Loader from '../components/Loader';

const InboxPage = () => {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.id;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/messages/inbox/${currentUserId}`);
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                    setFilteredMessages(response.data);
                } else {
                    console.warn("Inbox response is not an array", response.data);
                    setMessages([]);
                    setFilteredMessages([]);
                }
            } catch (error) {
                console.error("Failed to fetch inbox messages:", error);
                setMessages([]);
                setFilteredMessages([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/messages/unread-count/${currentUserId}`);
                setUnreadCount(Number(response.data) || 0);
            } catch (error) {
                console.error("Failed to fetch unread count:", error);
                setUnreadCount(0);
            }
        };

        if (currentUserId) {
            fetchMessages();
            fetchUnreadCount();
        }
    }, [currentUserId]);

    useEffect(() => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const filtered = messages.filter(message => 
                message.title.toLowerCase().includes(term) || 
                (message.sender?.name && message.sender.name.toLowerCase().includes(term))
            );
            setFilteredMessages(filtered);
        } else {
            setFilteredMessages(messages);
        }
    }, [searchTerm, messages]);

    const handleMessageClick = async (message) => {
        try {
            // Mark as read if unread
            if (!message.read) {
                await axios.put(`http://localhost:8080/api/messages/${message.id}/read`);
                setUnreadCount(prev => prev - 1);
                setMessages(prev => prev.map(msg => 
                    msg.id === message.id ? { ...msg, read: true } : msg
                ));
                setFilteredMessages(prev => prev.map(msg => 
                    msg.id === message.id ? { ...msg, read: true } : msg
                ));
            }
            setSelectedMessage(message);
        } catch (error) {
            console.error("Error marking message as read:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid tm-container-content tm-mt-60 px-3 px-md-4 px-lg-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div className="d-flex align-items-center">
                                <h2 className="tm-text-primary mb-0 me-2">Inbox</h2>
                                {unreadCount > 0 && (
                                    <span className="badge bg-primary rounded-pill">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="search-bar bg-light rounded p-2 mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-0">
                                    <FaSearch className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-0 bg-transparent"
                                    placeholder="Search messages by title or sender..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {loading ? (
                            <Loader></Loader>
                        ) : filteredMessages.length === 0 ? (
                            <div className="alert alert-info">
                                {searchTerm ? "No matching messages found" : "No messages found"}
                            </div>
                        ) : (
                            <div className="list-group">
                                {filteredMessages.map((message) => (
                                    <div 
                                        key={message.id} 
                                        className={`list-group-item ${!message.read ? 'bg-light' : ''}`}
                                        onClick={() => handleMessageClick(message)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                {message.read ? (
                                                    <FaEnvelopeOpen className="me-3 text-muted" />
                                                ) : (
                                                    <FaEnvelope className="me-3 text-primary" />
                                                )}
                                                <div>
                                                    <h6 className="mb-1">{message.title || 'No Title'}</h6>
                                                    <small className="text-muted">
                                                        From: {message.sender?.name || 'Unknown'}
                                                    </small>
                                                </div>
                                            </div>
                                            <small className="text-muted">
                                                {formatDate(message.timestamp)}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedMessage.title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSelectedMessage(null)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <p className="mb-1"><strong>Title:</strong> {selectedMessage.title|| 'No Title'}</p>
                                    <p className="mb-1"><strong>From:</strong> {selectedMessage.sender?.name || 'Unknown'}</p>
                                    <p className="mb-1"><strong>Date:</strong> {formatDate(selectedMessage.timestamp)}</p>
                                </div>
                                <hr />
                                <div className="message-content">
                                    {selectedMessage.content}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InboxPage;