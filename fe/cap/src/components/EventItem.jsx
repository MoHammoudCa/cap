import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { parseISO, isAfter, isBefore } from "date-fns";

const EventItem = ({ event }) => {
    const [isLiked, setIsLiked] = useState(event.isLiked || false);
    const [likeId, setLikeId] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"))?.id;
    
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
    };

    const statusInfo = event.date ? getEventStatus(event.date) : { 
        status: "Unknown", 
        icon: null,
        badgeClass: "bg-secondary"
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const checkLikeStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reactions`, {
                    params: {
                        eventId: event.id,
                        userId: user?.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.data.length > 0) {
                    setIsLiked(true);
                    setLikeId(response.data[0].id);
                }
            } catch (error) {
                console.error("Error checking like status:", error);
            }
        };

        if (user) {
            checkLikeStatus();
        }
    }, [event.id, user]);

    const handleLikeToggle = async () => {
        if (!user) {
            // Redirect to login or show a message
            return;
        }

        try {
            if (isLiked) {
                await axios.delete(`http://localhost:8080/api/reactions/${likeId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsLiked(false);
                setLikeId(null);
            } else {
                const response = await axios.post(
                    `http://localhost:8080/api/reactions`,
                    {
                        eventId: event.id,
                        type: "like"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setIsLiked(true);
                setLikeId(response.data.id);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
            <div className="card h-100">
                {!event.image ? (
                    <img
                        src="/src/assets/img/defaultEventImage.png"
                        alt="Default event image"
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                    />
                ) : (
                    <img 
                        src={event.image} 
                        alt="Event" 
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                    />
                )}
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{event.title}</h5>
                        <button 
                            onClick={handleLikeToggle}
                            className="btn btn-link p-0 border-0"
                            aria-label={isLiked ? "Unlike event" : "Like event"}
                        >
                            <i 
                                className={`fa-heart ${isLiked ? 'fas text-danger' : 'far'}`}
                                style={{ fontSize: '1.5rem' }}
                            ></i>
                        </button>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mb-3 d-flex align-items-center">
                        {statusInfo.icon}
                        <span className={`badge ${statusInfo.badgeClass} ms-1`}>
                            {statusInfo.status}
                        </span>
                    </div>
                    
                    {/* Organizer with Avatar */}
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

                    {/* Categories */}
                    <div className="mt-auto">
                        <div className="d-flex flex-wrap mb-3">
                            {event.categories?.map((category, index) => (
                                <span
                                    key={index}
                                    className="badge rounded-pill bg-info text-dark me-2 mb-2"
                                    style={{ fontSize: "0.75rem", padding: "0.35em 0.65em" }}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                        
                        <Link
                            to={`/event/${event.id}`}
                            className="btn btn-primary w-100 py-2"
                        >
                            More Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;