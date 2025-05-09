import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaHeart, 
  FaRegHeart, 
  FaTimesCircle, 
  FaCheckCircle, 
  FaHourglassHalf,
  FaUserCheck
} from "react-icons/fa";
import axios from "axios";
import { parseISO, isAfter, isBefore, format } from "date-fns";

const EventItem = ({ event, onDelete, onUpdate, showActions = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLoadingLike, setIsLoadingLike] = useState(false);
    const [isAttending, setIsAttending] = useState(false);
    const [attendanceCount, setAttendanceCount] = useState(0);
    
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
                icon: <FaTimesCircle className="text-danger me-2" />,
                badgeClass: "bg-danger"
            };
        } else if (isAfter(eventDateObj, now)) {
            return { 
                status: "Active", 
                icon: <FaCheckCircle className="text-success me-2" />,
                badgeClass: "bg-success"
            };
        } else {
            return { 
                status: "Happening Now", 
                icon: <FaHourglassHalf className="text-warning me-2" />,
                badgeClass: "bg-warning"
            };
        }
    };

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

    // Check if event has ended
    const isEventEnded = event.date ? isBefore(parseISO(event.date), new Date()) : false;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check like status
                if (currentUserId) {
                    const [likeStatusRes, attendanceStatusRes] = await Promise.all([
                        axios.get(`http://localhost:8080/api/likes/status`, {
                            params: { userId: currentUserId, eventId: event.id }
                        }),
                        axios.get(`http://localhost:8080/api/attendees/check`, {
                            params: { userId: currentUserId, eventId: event.id }
                        })
                    ]);
                    
                    setIsLiked(likeStatusRes.data.isLiked);
                    setIsAttending(attendanceStatusRes.data);
                }
                
                // Get counts
                const [likesCountRes, attendanceCountRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/likes/count/${event.id}`),
                    axios.get(`http://localhost:8080/api/attendees/count/${event.id}`)
                ]);
                
                setLikesCount(likesCountRes.data.count);
                setAttendanceCount(attendanceCountRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [event.id, currentUserId]);

    const handleLikeToggle = async () => {
        if (!currentUserId) return;
        setIsLoadingLike(true);
        
        try {
            if (isLiked) {
                await axios.delete(`http://localhost:8080/api/likes`, {
                    params: { userId: currentUserId, eventId: event.id }
                });
                setIsLiked(false);
                setLikesCount(prev => prev - 1);
            } else {
                await axios.post(`http://localhost:8080/api/likes`, null, {
                    params: { userId: currentUserId, eventId: event.id }
                });
                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setIsLoadingLike(false);
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
            <div className="card h-100 shadow-sm">
                <img 
                    src={event.image || "/default-event.jpg"} 
                    alt={event.title} 
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                            <h5 className="card-title mb-0 me-2">{event.title}</h5>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2 small">{likesCount}</span>
                            <button 
                                onClick={handleLikeToggle}
                                className="btn btn-link p-0 border-0"
                                disabled={isLoadingLike}
                                aria-label={isLiked ? "Unlike event" : "Like event"}
                                style={{ lineHeight: 1 }}
                            >
                                {isLoadingLike ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : isLiked ? (
                                    <FaHeart className="text-danger" style={{ fontSize: '1.25rem' }} />
                                ) : (
                                    <FaRegHeart className="text-muted" style={{ fontSize: '1.25rem' }} />
                                )}
                            </button>
                        </div>
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
                                    Hosted by <strong className="ms-2">{event.organizer.name}</strong>
                                </span>
                            </Link>
                        </div>
                    )}
                
                    {/* Capacity Indicator */}
                    {event.capacity && (
                        <div className="mb-3">
                            <div className="progress" style={{ height: "6px" }}>
                                <div 
                                    className="progress-bar bg-info" 
                                    role="progressbar" 
                                    style={{ 
                                        width: `${Math.min(100, (attendanceCount / event.capacity) * 100)}%` 
                                    }}
                                    aria-valuenow={attendanceCount}
                                    aria-valuemin="0"
                                    aria-valuemax={event.capacity}
                                ></div>
                            </div>
                            <small className="text-muted">
                                {attendanceCount}/{event.capacity} spots filled
                            </small>
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
                                <p className="mb-2">
                                    <i className="fa-solid fa-calendar-days text-muted me-3" style={{ width: "20px" }}></i>
                                    {formatDate(event.date)}
                                </p>
                                <p className="mb-2">
                                    <i className="fa-solid fa-clock text-muted me-3" style={{ width: "20px" }}></i>
                                    {formatTime(event.date)}
                                </p>
                            </>
                        )}

                        {event.location && (
                            <p className="mb-2">
                                <i className="fa-solid fa-location-dot text-muted me-3" style={{ width: "20px" }}></i>
                                {event.location}
                            </p>
                        )}
                    </div>

                    {/* Categories Section - Updated */}
                        {categories.length > 0 && (
                            <div className="mb-3">
                                <div className="d-flex flex-wrap" style={{ gap: "0.2rem 0.3rem" }}>
                                    {categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="badge rounded-pill bg-info text-dark"
                                            style={{ 
                                                fontSize: "0.75rem", 
                                                padding: "0.25em 0.62em",
                                                // margin: "0.00001rem" // Added margin to prevent touching
                                            }}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    <div className="d-flex justify-content-between mt-auto pt-2">
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
                                    <FaEdit className="me-2" /> Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-sm btn-outline-danger"
                                >
                                    <FaTrash className="me-2" /> Delete
                                </button>
                            </div>
                        )}
                        {/* Attending/Attended Badge */}
                        {isAttending && (
                                <span className={`badge ${isEventEnded ? 'bg-secondary' : 'bg-success'} d-flex align-items-center`}>
                                    <FaUserCheck className="me-2" />
                                    {isEventEnded ? 'Attended' : 'Attending'}
                                </span>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;