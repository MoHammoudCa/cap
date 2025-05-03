import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventItem from "./EventItem";
import SearchAndFilter from "./Search&Filter";
import axios from "axios";

const MyEventsComp = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [originalEvents, setOriginalEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const normalizeEvent = (event) => {
    const categories =
      typeof event?.categories === "string"
        ? event.categories
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    return {
      id: event?.id || null,
      title: event?.title || "Untitled Event",
      description: event?.description || "",
      date: event?.date || null,
      isFollowing: Boolean(event?.isFollowing),
      isLiked: Boolean(event?.isLiked),
      categories,
      image: event.image,
      location: event.location,
      organizer: event.organizer,
      capacity: event.capacity,
    };
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error("User not logged in");

      const response = await axios.get(
        `http://localhost:8080/api/events/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const normalizedEvents = Array.isArray(response.data)
        ? response.data.map(normalizeEvent)
        : [];

      setOriginalEvents(normalizedEvents);
      setFilteredEvents(normalizedEvents);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching user events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedEventId) => {
    setOriginalEvents((prev) => prev.filter((event) => event.id !== deletedEventId));
    setFilteredEvents((prev) => prev.filter((event) => event.id !== deletedEventId));
  };

  const handleUpdate = (updatedEvent) => {
    setOriginalEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setFilteredEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5">
        Error: {error}
        <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchEvents}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid tm-container-content tm-mt-60">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Events</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/create")}
        >
          Create New Event
        </button>
      </div>
      <SearchAndFilter
        events={originalEvents}
        setFilteredEvents={setFilteredEvents}
        setLoading={setLoading}
        setError={setError}
      />
      <div className="row tm-mb-90 tm-gallery">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              showActions={true}
            />
          ))
        ) : (
          <div className="alert alert-info">
            No events found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsComp;