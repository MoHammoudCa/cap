import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import '../assets/css/eventDetails.css'


const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const normalizeEvent = (event) => {
    const categories =
      typeof event?.categories === "string"
        ? event.categories
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : Array.isArray(event?.categories) 
          ? event.categories
          : [];

    return {
      ...event,
      id: event?.id || `event-${Math.random().toString(36).substr(2, 9)}`,
      title: event?.title || "Untitled Event",
      description: event?.description || "",
      date: event?.date || null,
      isFollowing: Boolean(event?.isFollowing),
      isLiked: Boolean(event?.isLiked),
      categories,
      image: event?.image,
      location: event?.location
    };
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
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(normalizeEvent(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "MMMM do, yyyy");
  };

  const formatTime = (dateString) => {
    return format(parseISO(dateString), "h:mm a");
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mx-3">Error: {error}</div>;
  if (!event) return <div className="alert alert-warning mx-3">Event not found</div>;


  const statusInfo = event.date ? getEventStatus(event.date) : { 
	status: "Unknown", 
	icon: null,
	badgeClass: "bg-secondary"
  };
  
  return (
    <div className="container-fluid tm-container-content" style={{ paddingBottom: "100px" }}>
      <div className="row mb-4">
        <h2 className="col-12 tm-text-primary">{event.title}</h2>
      </div>
      
      {/* Main Content Row */}
      <div className="row">
        {/* Left Column - Image and Description */}
        <div className="col-lg-8 pe-lg-4">
          {/* Full-width Image - now with proper height */}
          <div className="mb-4">
            <img 
              src={event.image || "/default-event.jpg"} 
              alt={event.title} 
              className="img-fluid w-100 rounded" 
              style={{ maxHeight: "70vh", objectFit: "contain" }}
            />
          </div>
          
          {/* Description */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h3 className="h4 mb-3">About This Event</h3>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                {event.description || "No description available."}
              </p>
            </div>
          </div>
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
                  <span>{event.capacity || "Unlimited"}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Price</span>
                  <span>{event.price ? `$${event.price}` : "Free"}</span>
                </li>
              </ul>

              {/* Categories with better spacing */}
              <div className="mt-4 mb-5">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;