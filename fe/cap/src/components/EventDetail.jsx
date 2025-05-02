import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUser, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaTicketAlt,
  FaUserCheck,
  FaTimes
} from "react-icons/fa";
import axios from "axios";
import { parseISO, isAfter, isBefore, format } from "date-fns";
import EventItem from "./EventItem";
import '../assets/css/eventDetails.css';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  const normalizeEvent = (event) => {
    const categories =
      typeof event?.categories === "string"
        ? event.categories.split(",").map(item => item.trim()).filter(Boolean)
        : Array.isArray(event?.categories) 
          ? event.categories
          : [];

    return {
      ...event,
      id: event?.id || `event-${Math.random().toString(36).substr(2, 9)}`,
      title: event?.title || "Untitled Event",
      description: event?.description || "",
      date: event?.date || null,
      categories,
      image: event?.image,
      location: event?.location,
      capacity: event?.capacity || 0
    };
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const [eventRes, attendanceRes, countRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/events/${id}`),
        currentUserId ? axios.get(`http://localhost:8080/api/attendees/check`, {
          params: { userId: currentUserId, eventId: id }
        }) : { data: false },
        axios.get(`http://localhost:8080/api/attendees/count/${id}`)
      ]);

      const normalizedEvent = normalizeEvent(eventRes.data);
      setEvent(normalizedEvent);
      setIsAttending(attendanceRes.data);
      setAttendanceCount(countRes.data);

      fetchSimilarEvents(normalizedEvent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarEvents = async (currentEvent) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/`);
      const now = new Date();
      
      const otherEvents = response.data
        .filter(e => e.id !== currentEvent.id && new Date(e.date) > now)
        .map(normalizeEvent);
      
      setSimilarEvents(otherEvents.slice(0, 3));
    } catch (err) {
      console.error("Error fetching similar events:", err);
      setSimilarEvents([]);
    }
  };

  const handleAttendance = async () => {
    if (!currentUserId) return;
    
    if (isAttending) {
      try {
        setIsLoadingAttendance(true);
        console.log(currentUserId , id);
        await axios.delete(`http://localhost:8080/api/attendees`, {
          params: { userId: currentUserId, eventId: id }
        });
        setIsAttending(false);
        setAttendanceCount(prev => prev - 1);
      } catch (error) {
        console.error("Error canceling attendance:", error);
      } finally {
        setIsLoadingAttendance(false);
      }
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmAttendance = async () => {
    try {
      setIsLoadingAttendance(true);
      await axios.post(`http://localhost:8080/api/attendees`, null, {
        params: { userId: currentUserId, eventId: id }
      });
      setIsAttending(true);
      setAttendanceCount(prev => prev + 1);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error registering attendance:", error);
      alert(error.response?.data?.message || "Cannot register for this event");
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "MMMM do, yyyy");
  };

  const formatTime = (dateString) => {
    return format(parseISO(dateString), "h:mm a");
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
  };

  useEffect(() => {
    fetchEvent();
  }, [id, currentUserId]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mx-3">Error: {error}</div>;
  if (!event) return <div className="alert alert-warning mx-3">Event not found</div>;

  const statusInfo = event.date ? getEventStatus(event.date) : { 
    status: "Unknown", 
    icon: null,
    badgeClass: "bg-secondary"
  };

  const isOrganizer = event.organizer?.id === currentUserId;
  const isFull = event.capacity && attendanceCount >= event.capacity;
  const remainingSpots = event.capacity ? event.capacity - attendanceCount : null;

  return (
    <div className="container-fluid tm-container-content" style={{ paddingBottom: "100px" }}>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Attendance</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowConfirmModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to register for "{event.title}"?</p>
                {event.capacity && (
                  <p className="small text-muted">
                    {attendanceCount}/{event.capacity} spots already reserved
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isLoadingAttendance}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={confirmAttendance}
                  disabled={isLoadingAttendance}
                >
                  {isLoadingAttendance ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <h2 className="col-12 tm-text-primary">{event.title}</h2>
      </div>
      
      <div className="row">
        {/* Left Column - Image and Description */}
        <div className="col-lg-8 pe-lg-4">
          <div className="mb-4">
            <img 
              src={event.image || "/default-event.jpg"} 
              alt={event.title} 
              className="img-fluid w-100 rounded" 
              style={{ maxHeight: "70vh", objectFit: "contain" }}
            />
          </div>
          
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h3 className="h4 mb-3">About This Event</h3>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                {event.description || "No description available."}
              </p>
            </div>
          </div>

          {similarEvents.length > 0 && (
            <div className="mt-5">
              <h3 className="tm-text-primary mb-4">Similar Events You Might Like</h3>
              <div className="row">
                {similarEvents.map((similarEvent) => (
                  <div className="col-md-4 mb-4" key={similarEvent.id}>
                    <div className="card h-100 shadow-sm">
                      <Link to={`/event/${similarEvent.id}`} className="text-decoration-none">
                        <img 
                          src={similarEvent.image || "/default-event.jpg"} 
                          className="card-img-top" 
                          alt={similarEvent.title}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title text-dark">{similarEvent.title}</h5>
                          <div className="d-flex align-items-center text-muted small mb-2">
                            <FaCalendarAlt className="me-2" />
                            <span>{formatDate(similarEvent.date)}</span>
                          </div>
                          <div className="d-flex align-items-center text-muted small">
                            <FaMapMarkerAlt className="me-2" />
                            <span>{similarEvent.location || "Location not specified"}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Event Details */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Event Details</h3>
              
              {/* Organizer */}
              {event.organizer && (
                <div className="d-flex align-items-center mb-3">
                  <Link to={`/organizer/${event.organizer.id}`} className="text-decoration-none d-flex align-items-center">
                    <img 
                      src={event.organizer.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer.name)}&background=random`}
                      alt={event.organizer.name}
                      className="rounded-circle me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    <span className="text-dark">
                      Hosted by <strong>{event.organizer.name}</strong>
                    </span>
                  </Link>
                </div>
              )}

              {/* Date & Time */}
              <div className="d-flex align-items-center mb-2">
                <FaCalendarAlt className="text-muted me-2" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaClock className="text-muted me-2" />
                <span>{formatTime(event.date)}</span>
              </div>

              {/* Location */}
              <div className="d-flex align-items-center mb-4">
                <FaMapMarkerAlt className="text-muted me-2" />
                <span>{event.location}</span>
              </div>

              {/* Additional Info */}
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Status</span>
                  <span className="d-flex align-items-center">
                    {statusInfo.icon}
                    <span className={`badge ${statusInfo.badgeClass}`}>
                      {statusInfo.status}
                    </span>
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Capacity</span>
                  <span>
                    {event.capacity ? `${attendanceCount}/${event.capacity}` : "Unlimited"}
                    {remainingSpots !== null && ` (${remainingSpots} remaining)`}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Price</span>
                  <span>{event.price ? `$${event.price}` : "Free"}</span>
                </li>
              </ul>

              {/* Categories */}
              <div className="mb-4">
                <h4 className="h6 mb-3">Categories</h4>
                <div className="d-flex flex-wrap gap-2">
                  {event.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="badge rounded-pill bg-info text-dark"
                      style={{ 
                        fontSize: "0.85rem",
                        padding: "0.5em 0.8em",
                        fontWeight: "500"
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attendance Button */}
              {currentUserId && !isOrganizer && (
                <div className="mt-4">
                  {isFull && !isAttending ? (
                    <button className="btn btn-secondary w-100" disabled>
                      <FaTicketAlt className="me-2" /> Event Full
                    </button>
                  ) : (
                    <button
                      onClick={handleAttendance}
                      disabled={isLoadingAttendance}
                      className={`btn ${isAttending ? 'btn-outline-danger' : 'btn-primary'} w-100`}
                    >
                      {isLoadingAttendance ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      ) : isAttending ? (
                        <>
                          <FaTimes className="me-2" /> Cancel Attendance
                        </>
                      ) : (
                        <>
                          <FaTicketAlt className="me-2" /> Reserve Spot
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;