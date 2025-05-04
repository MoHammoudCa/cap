import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  FaUserFriends, 
  FaHeart, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaSignOutAlt,
  FaCamera 
} from "react-icons/fa";
import axios from "axios";
import EventItem from "../components/EventItem";
import Loader from "../components/Loader";

const Profile = () => {
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const [user, setUser] = useState({});
  const { id, name, email, role, profilePicture, created_at } = user;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({
    followersCount: 0,
    followingCount: 0,
    likedEventsCount: 0,
    attendedEventsCount: 0,
    followersList: [],
    followingList: [],
    likedEventsList: []
  });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const fileInputRef = useRef(null);
  const { logout } = useAuth();

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, followersResponse, followingResponse, 
               likedEventsResponse, attendedEventsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${userId}`),
          axios.get(`http://localhost:8080/api/follows/followers/${userId}`),
          axios.get(`http://localhost:8080/api/follows/following/${userId}`),
          axios.get(`http://localhost:8080/api/likes/user/${userId}`),
          axios.get(`http://localhost:8080/api/attendees/user/${userId}/ended/count`)
        ]);

        setUser(userResponse.data);
        setStats({
          followersCount: followersResponse.data.length,
          followingCount: followingResponse.data.length,
          likedEventsCount: likedEventsResponse.data.length,
          attendedEventsCount: attendedEventsResponse.data,
          followersList: followersResponse.data,
          followingList: followingResponse.data,
          likedEventsList: likedEventsResponse.data
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/attendees/user/${userId}/upcoming`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        const sortedEvents = response.data
          .map(attendance => attendance.event)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setRegisteredEvents(sortedEvents);
      } catch (err) {
        console.error("Error fetching registered events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchProfileData();
    fetchRegisteredEvents();
  }, [userId]);

  const handleLogout = async () => {
    await logout();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      alert("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const imgbbUrl = `https://api.imgbb.com/1/upload?key=b76b2619b45c9ba98787c8a173723e7c`;
      const formData = new FormData();
      formData.append("image", file);
  
      const imgbbResponse = await fetch(imgbbUrl, {
        method: "POST",
        body: formData,
      });
  
      const imgbbData = await imgbbResponse.json();
  
      if (!imgbbData.success) {
        throw new Error("Image upload to imgBB failed");
      }
  
      const imageUrl = imgbbData.data.url;
  
      const token = localStorage.getItem("token");
      const updateResponse = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            profilePicture: imageUrl,
          }),
        }
      );
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const updatedUser = await updateResponse.json();
      setUser(updatedUser);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      alert(err.message || "Failed to update profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <Loader></Loader>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div
              className="avatar-container"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleImageClick}
            >
              <img
                src={
                  profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name
                  )}&background=random`
                }
                alt={name}
                className="profile-avatar"
              />
              {isHovering && (
                <div className="avatar-overlay">
                  <div className="camera-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                      <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  </div>
                  <span className="change-text">Change Photo</span>
                </div>
              )}
              {isUploading && (
                <div className="uploading-overlay">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            <h2 className="profile-name">{name}</h2>
          </div>

          {/* Stats Section */}
          <div className="d-flex justify-content-around text-center mb-4 py-3 border-top border-bottom">
            <div>
              <Link to={`/user/${userId}/followers`} className="text-decoration-none text-dark">
                <div className="fs-4 fw-bold">{stats.followersCount}</div>
                <div className="text-muted small">
                  <FaUserFriends className="me-1" />
                  Followers
                </div>
              </Link>
            </div>
            <div>
              <Link to={`/user/${userId}/following`} className="text-decoration-none text-dark">
                <div className="fs-4 fw-bold">{stats.followingCount}</div>
                <div className="text-muted small">
                  <FaUserFriends className="me-1" />
                  Following
                </div>
              </Link>
            </div>
            <div>
              <Link to={`/user/${userId}/liked-events`} className="text-decoration-none text-dark">
                <div className="fs-4 fw-bold">{stats.likedEventsCount}</div>
                <div className="text-muted small">
                  <FaHeart className="me-1" />
                  Liked Events
                </div>
              </Link>
            </div>
            <div>
                  <Link to={`/user/${userId}/attended-events`} className="text-decoration-none text-dark">
                      <div className="fs-4 fw-bold">{stats.attendedEventsCount}</div>
                      <div className="text-muted small">
                        <FaCheckCircle className="me-1" />
                        Attended
                      </div>
                    </Link>
                  </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{email}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-button" onClick={handleLogout}>Logout</button>
            {/* {role === "ADMIN" && (
              <button className="admin-button">Admin Panel</button>
            )} */}
          </div>
        </div>
      </div>
            

      <div className="container-fluid tm-container-content tm-mt-60">
      <h2>Upcoming Events</h2>

<div className="row tm-mb-90 tm-gallery">
    {registeredEvents.length > 0 ? (
        registeredEvents.map((event) => (
            <EventItem 
                key={event.id} 
                event={event} 
            />
        ))
    ) : (
        <div className="col-12">
            <div className="alert alert-info">
                No events found. Register your first event!
            </div>
        </div>
    )}
</div>
</div>


      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </>
  );
};

export default Profile;