import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventItem from "./EventItem";
import SearchAndFilter from "./Search&Filter";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

const OrganizerProfileComp = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.id;

  console.log("USER " + currentUserId)

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

  const checkFollowStatus = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await axios.get(`http://localhost:8080/api/follows/status`, {
        params: { followerId: currentUserId, followedId: id }
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const fetchFollowersCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/follows/count/${id}`);
      setFollowersCount(response.data.count);
    } catch (error) {
      console.error("Error fetching followers count:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId) return;
    setIsLoadingFollow(true);
    
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:8080/api/follows`, {
          params: { followerId: currentUserId, followedId: id }
        });
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await axios.post(`http://localhost:8080/api/follows`, {
          followerId: currentUserId,
          followedId: id
        });
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoadingFollow(false);
    }
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

        await Promise.all([
          checkFollowStatus(),
          fetchFollowersCount()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);

  if (loading) return <div className="text-center py-5">Loading organizer...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  

  return (
    <div className="container-fluid tm-container-content tm-mt-60 px-3 px-md-4 px-lg-5">
      {/* Organizer Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
            <div className="flex-shrink-0">
              <img 
                src={organizer?.profilePicture || 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(organizer?.name || '')}&background=random`}
                alt={organizer?.name}
                className="rounded-circle"
                style={{ 
                  width: "80px", 
                  height: "80px", 
                  objectFit: "cover",
                  border: "2px solid #f5f5f5"
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=O&background=random`;
                }}
              />
            </div>
            <div className="flex-grow-1 text-left text-md-start">
              <h2 className="tm-text-primary mb-2">{organizer?.name || 'Organizer'}</h2>
              <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                <span className="text-muted">
                  {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                </span>
                {currentUserId && currentUserId !== id && (
                  <button 
                    onClick={handleFollowToggle}
                    disabled={isLoadingFollow}
                    className={`btn btn-sm ${isFollowing ? 'btn-outline-secondary' : 'btn-primary'} px-3 py-1`}
                    style={{
                      minWidth: "100px",
                      fontSize: "0.85rem",
                      borderRadius: "20px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isLoadingFollow ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <span className="d-flex align-items-center justify-content-center gap-1">
                        {isFollowing ? (
                          <>
                            <FaUserCheck /> Following
                          </>
                        ) : (
                          <>
                            <FaUserPlus /> Follow
                          </>
                        )}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4">
        <SearchAndFilter
          events={originalEvents}
          setFilteredEvents={setFilteredEvents}
          setLoading={setLoading}
          setError={setError}
        />
      </div>

      {/* Events Grid */}
      <div className="row">
        <div className="col-12">
          <h3 className="h4 mb-3">Organized Events</h3>
          {filteredEvents.length > 0 ? (
            <div className="row tm-mb-90 tm-gallery">
              {filteredEvents.map((event) => (
                <EventItem key={event.id} event={event} showActions={currentUserId === id} />
              ))}
            </div>
          ) : (
            <div className="alert alert-info mt-3">
              No events found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfileComp;