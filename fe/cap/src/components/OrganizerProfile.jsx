import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventItem from "./EventItem";
import SearchAndFilter from "./Search&Filter";

const OrganizerProfileComp = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      isFollowing: Boolean(event?.isFollowing),
      isLiked: Boolean(event?.isLiked),
      categories,
      image: event?.image,
      location: event?.location,
      organizer: organizer
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [organizerRes, eventsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${id}`),
          axios.get(`http://localhost:8080/api/events/user/${id}`)
        ]);
        
        setOrganizer(organizerRes.data);
        
        const normalizedEvents = Array.isArray(eventsRes.data)
          ? eventsRes.data.map(normalizeEvent)
          : [];
        
        setOriginalEvents(normalizedEvents);
        setFilteredEvents(normalizedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading organizer...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container-fluid tm-container-content tm-mt-60">
      {/* Organizer Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex align-items-center">
          <img 
            src={organizer?.profile_picture || 
                 `https://ui-avatars.com/api/?name=${encodeURIComponent(organizer?.name || '')}&background=random`}
            alt={organizer?.name}
            className="rounded-circle me-3"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div>
            <h2 className="tm-text-primary mb-1">{organizer?.name || 'Organizer'}</h2>
            <p className="text-muted mb-0">Event Organizer</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        events={originalEvents}
        setFilteredEvents={setFilteredEvents}
        setLoading={setLoading}
        setError={setError}
      />

      {/* Events Grid */}
      <div className="row">
        <div className="col-12">
          <h3 className="h4 mb-4">Organized Events</h3>
          {filteredEvents.length > 0 ? (
            <div className="row tm-mb-90 tm-gallery">
              {filteredEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No events found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfileComp;