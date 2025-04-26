import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EventItem = ({ event }) => {
    const [isLiked, setIsLiked] = useState(event.isLiked || false);
    const [likeId, setLikeId] = useState(null);
	const user = JSON.parse(localStorage.getItem("user"))?.id;
    
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
        // Check if the event is already liked by the user
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
                // Unlike the event
                await axios.delete(`http://localhost:8080/api/reactions/${likeId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsLiked(false);
                setLikeId(null);
            } else {
                // Like the event
                const response = await axios.post(
                    `http://localhost:8080/api/reactions`,
                    {
                        eventId: event.id,
                        type: "like" // or whatever type you want to use
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
            <div className="card">
                {!event.image ? (
                    <img
                        src="/src/assets/img/defaultEventImage.png"
                        alt="Default event image"
                        className="card-img-top"
                    />
                ) : (
                    <img src={event.image} alt="Event" className="img-fluid" />
                )}
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
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
                    
                    {event.organizer && (
                        <p>
                            <i className="fa-regular fa-user"></i> {event.organizer.name|| 'unknown'}
                        </p>
                    )}
                    {event.date && (
                        <>
                            <p>
                                <i className="fa-solid fa-calendar-days"></i>{" "}
                                {formatDate(event.date)}
                            </p>
                            <p>
                                <i className="fa-solid fa-clock"></i> {formatTime(event.date)}
                            </p>
                        </>
                    )}

                    {event.location && (
                        <>
                            <p>
                                <i className="fa-solid fa-location-dot"></i> {event.location}
                            </p>
                        </>
                    )}

                    <p style={{ marginBottom: "10px" }}>
                        {event.categories &&
                            event.categories?.map((category, index) => (
                                <span
                                    key={index}
                                    className="badge rounded-pill bg-info text-dark"
                                    style={{ fontSize: "15px", margin: "5px" }}
                                >
                                    {category}
                                </span>
                            ))}
                    </p>
                    <div className="row align-items-center g-2">
                        <div className="col-md-6 col-12">
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
        </div>
    );
};

export default EventItem;