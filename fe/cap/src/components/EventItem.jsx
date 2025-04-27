import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaHeart, FaRegHeart, FaTimesCircle, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import axios from "axios";
import { parseISO, isAfter, isBefore, format } from "date-fns";


const EventItem = ({ event, onDelete, onUpdate, showActions = false }) => {
    const [isLiked, setIsLiked] = useState(event.isLiked || false);
    const [likeId, setLikeId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.id;
    const isOrganizer = event.organizer?.id === currentUserId;

    const normalizeCategories = (categories) => {
        if (typeof categories === "string") {
            return categories.split(',').map(item => item.trim()).filter(Boolean);
        }
        if (Array.isArray(categories)) {
            return categories;
        }
        return [];
    };
	const getEventStatus = (eventDate) => {
        const now = new Date();
        const eventDateObj = parseISO(eventDate);
        
        if (isBefore(eventDateObj, now)) {
            return { 
                status: "Ended", 
                icon: <FaTimesCircle className="text-danger me-1" />,
                badgeClass: "bg-danger"
            };
        } else if (isAfter(eventDateObj, now)) {
            return { 
                status: "Active", 
                icon: <FaCheckCircle className="text-success me-1" />,
                badgeClass: "bg-success"
            };
        } else {
            return { 
                status: "Happening Now", 
                icon: <FaHourglassHalf className="text-warning me-1" />,
                badgeClass: "bg-warning"
            };
		}
	}
	const statusInfo = event.date ? getEventStatus(event.date) : { 
        status: "Unknown", 
        icon: null,
        badgeClass: "bg-secondary"
    };

    const categories = normalizeCategories(event.categories);

    const formatDate = (dateString) => {
        return format(parseISO(dateString), "MMM dd, yyyy");
    };

    const formatTime = (dateString) => {
        return format(parseISO(dateString), "h:mm a");
    };

    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reactions`, {
                    params: { eventId: event.id, userId: currentUserId },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                
                if (response.data.length > 0) {
                    setIsLiked(true);
                    setLikeId(response.data[0].id);
                }
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        };

        if (currentUserId) checkLikeStatus();
    }, [event.id, currentUserId]);

    const handleLikeToggle = async () => {
        if (!currentUserId) return;

        try {
            if (isLiked) {
                await axios.delete(`http://localhost:8080/api/reactions/${likeId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setIsLiked(false);
                setLikeId(null);
            } else {
                const response = await axios.post(
                    `http://localhost:8080/api/reactions`,
                    { eventId: event.id, type: "like" },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setIsLiked(true);
                setLikeId(response.data.id);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`http://localhost:8080/api/events/${event.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                onDelete(event.id);
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event");
            }
        }
    };

    return (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
            <div className="card h-100">
                <img 
                    src={event.image || "/default-event.jpg"} 
                    alt={event.title} 
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{event.title}</h5>
                        <button 
                            onClick={handleLikeToggle}
                            className="btn btn-link p-0 border-0"
                            aria-label={isLiked ? "Unlike event" : "Like event"}
                        >
                            {isLiked ? (
                                <FaHeart className="text-danger" style={{ fontSize: '1.5rem' }} />
                            ) : (
                                <FaRegHeart style={{ fontSize: '1.5rem' }} />
                            )}
                        </button>
                    </div>

                    {event.organizer && (
                        <div className="d-flex align-items-center mb-3">
                            <Link 
                                to={`/organizer/${event.organizer.id}`} 
                                className="text-decoration-none d-flex align-items-center"
                            >
                                <img 
                                    src={event.organizer.profilePicture || 
                                         `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer.name)}&background=random`}
                                    alt={event.organizer.name}
                                    className="rounded-circle me-2"
                                    style={{ width: "30px", height: "30px", objectFit: "cover" }}
                                />
                                <span className="text-muted small">
                                    Hosted by <strong>{event.organizer.name}</strong>
                                </span>
                            </Link>
                        </div>
                    )}
				
					 {/* Status Badge */}
					 <div className="mb-3 d-flex align-items-center">
                        {statusInfo.icon}
                        <span className={`badge ${statusInfo.badgeClass} ms-1`}>
                            {statusInfo.status}
                        </span>
                    </div>

                    {/* Event Details */}
                    <div className="mb-3">
                        {event.date && (
                            <>
                                <p className="mb-1">
                                    <i className="fa-solid fa-calendar-days text-muted me-2"></i>
                                    {formatDate(event.date)}
                                </p>
                                <p className="mb-1">
                                    <i className="fa-solid fa-clock text-muted me-2"></i>
                                    {formatTime(event.date)}
                                </p>
                            </>
                        )}

                        {event.location && (
                            <p className="mb-1">
                                <i className="fa-solid fa-location-dot text-muted me-2"></i>
                                {event.location}
                            </p>
                        )}
                    </div>

                    {categories.length > 0 && (
                        <div className="mb-3">
                            <div className="d-flex flex-wrap gap-1">
                                {categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="badge rounded-pill bg-info text-dark"
                                        style={{ fontSize: "0.75rem", padding: "0.35em 0.65em" }}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-auto">
                        <Link
                            to={`/event/${event.id}`}
                            className="btn btn-sm btn-outline-primary"
                        >
                            View Details
                        </Link>
                        {showActions && isOrganizer && (
                            <div>
                                <Link
                                    to={`/event/${event.id}/edit`}
                                    className="btn btn-sm btn-outline-secondary me-2"
                                >
                                    <FaEdit className="me-1" /> Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-sm btn-outline-danger"
                                >
                                    <FaTrash className="me-1" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;