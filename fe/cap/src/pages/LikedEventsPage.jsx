import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { parseISO, isAfter, isBefore, format } from "date-fns";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";


const LikedEventsPage = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [originalEvents, setOriginalEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateObj = parseISO(eventDate);
    
    if (isBefore(eventDateObj, now)) {
      return { 
        status: "Ended", 
        badgeClass: "bg-danger"
      };
    } else if (isAfter(eventDateObj, now)) {
      return { 
        status: "Active", 
        badgeClass: "bg-success"
      };
    } else {
      return { 
        status: "Happening Now", 
        badgeClass: "bg-warning"
      };
    }
  };

  useEffect(() => {
    const fetchLikedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/likes/user-events/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Add status to each event
        const eventsWithStatus = response.data.map(like => ({
          ...like,
          event: {
            ...like.event,
            statusInfo: like.event.date ? getEventStatus(like.event.date) : {
              status: "Unknown",
              badgeClass: "bg-secondary"
            }
          }
        }));
        
        setOriginalEvents(eventsWithStatus);
        setFilteredEvents(eventsWithStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedEvents();
  }, [userId, token]);

  const handleUnlike = async (eventId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/likes`,
        {
          params: { userId, eventId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setOriginalEvents(prev => prev.filter(like => like.event.id !== eventId));
      setFilteredEvents(prev => prev.filter(like => like.event.id !== eventId));
    } catch (error) {
      console.error("Error unliking event:", error);
    }
  };

  if (loading) <Loader></Loader>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (

    <>
    <Navbar/>
    <div className="container-fluid tm-container-content tm-mt-60 px-3 px-md-4 px-lg-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <h2 className="tm-text-primary mb-0 me-2">Liked Events</h2>
            <span className="badge bg-primary rounded-pill">
              <FaHeart className="me-1" />
              {originalEvents.length}
            </span>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className="alert alert-info">
              {originalEvents.length === 0 
                ? "No liked events found." 
                : "No events match your filters."}
            </div>
          ) : (
            <div className="row tm-mb-90 tm-gallery">
              {filteredEvents.map((like) => (
                <div key={like.event.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                  <div className="card h-100 shadow-sm">
                    <img 
                      src={like.event.image || "/default-event.jpg"} 
                      alt={like.event.title} 
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{like.event.title}</h5>
                        <span className={`badge ${like.event.statusInfo.badgeClass}`}>
                          {like.event.statusInfo.status}
                        </span>
                      </div>
                      
                      {like.event.organizer && (
                        <div className="d-flex align-items-center mb-3">
                          <Link 
                            to={`/organizer/${like.event.organizer.id}`} 
                            className="text-decoration-none d-flex align-items-center"
                          >
                            <img 
                              src={like.event.organizer.profilePicture || 
                                   `https://ui-avatars.com/api/?name=${encodeURIComponent(like.event.organizer.name)}&background=random`}
                              alt={like.event.organizer.name}
                              className="rounded-circle me-2"
                              style={{ width: "30px", height: "30px", objectFit: "cover" }}
                            />
                            <span className="text-muted small">
                              Hosted by <strong>{like.event.organizer.name}</strong>
                            </span>
                          </Link>
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <Link
                            to={`/event/${like.event.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleUnlike(like.event.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <FaHeart className="me-1 text-danger" /> Unlike
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default LikedEventsPage;