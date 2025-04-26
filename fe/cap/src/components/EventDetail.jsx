import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaTicketAlt } from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent({
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : 
                     data.categories ? [data.categories] : []
        });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container-fluid tm-container-content tm-mt-60">
      <div className="row mb-4">
        <h2 className="col-12 tm-text-primary">{event.title}</h2>
      </div>
      
      {/* Image and Details Row */}
      <div className="row tm-mb-40">
        {/* Event Image */}
        <div className="col-xl-8 col-lg-7 col-md-12 mb-4">
          <img 
            src={event.image || "/default-event.jpg"} 
            alt={event.title} 
            className="img-fluid rounded" 
            style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Event Details Sidebar */}
        <div className="col-xl-4 col-lg-5 col-md-12">
          <div className="tm-bg-gray tm-video-details p-4 rounded h-100">
            {/* Event Details content remains the same */}
            <div className="mb-4">
              <h3 className="h5 mb-3">Event Details</h3>
              
              {/* Organizer */}
              {event.organizer && (
                <div className="d-flex align-items-center mb-3">
                  <FaUser className="text-muted me-2" />
                  <span>Hosted by <strong>{event.organizer.name}</strong></span>
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
                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                  <span>Status</span>
                  <span className="badge bg-success">Active</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                  <span>Capacity</span>
                  <span>{event.capacity || "Unlimited"}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                  <span>Price</span>
                  <span>{event.price ? `$${event.price}` : "Free"}</span>
                </li>
              </ul>

              {/* Get Tickets Button */}
              <div className="text-center mb-4">
                <button className="btn btn-primary">
                  <FaTicketAlt className="me-2" />
                  Get Tickets
                </button>
              </div>

              {/* Categories */}
              <div className="mb-2">
                <h4 className="h6">Categories</h4>
                <div>
                  {event.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="badge rounded-pill bg-info text-dark me-2 mb-2"
                      style={{ fontSize: "14px" }}
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

      {/* Description Row - full width below */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h4 mb-3">About This Event</h3>
              <p className="card-text" style={{ whiteSpace: "pre-line" }}>
                {event.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;