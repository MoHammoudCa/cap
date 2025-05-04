import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaUserFriends, FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const FollowersPage = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/follows/followers/${userId}`);
        const followersWithDetails = await Promise.all(
          response.data.map(async (followerId) => {
            const userResponse = await axios.get(`http://localhost:8080/api/users/${followerId}`);
            return userResponse.data;
          })
        );
        setFollowers(followersWithDetails);
        setFilteredFollowers(followersWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = followers.filter(user => 
        user.name.toLowerCase().includes(term) || 
        (user.email && user.email.toLowerCase().includes(term))
      );
      setFilteredFollowers(filtered);
    } else {
      setFilteredFollowers(followers);
    }
  }, [searchTerm, followers]);

  const handleUnfollow = async (followerId) => {
    try {
      await axios.delete(`http://localhost:8080/api/follows`, {
        params: { followerId, followedId: userId }
      });
      setFollowers(followers.filter(user => user.id !== followerId));
      setFilteredFollowers(filteredFollowers.filter(user => user.id !== followerId));
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
  };

  if (loading) return <Loader></Loader>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <>
    <Navbar/>
    <div className="container-fluid tm-container-content tm-mt-60 px-3 px-md-4 px-lg-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <h2 className="tm-text-primary mb-0 me-2">Followers</h2>
            <span className="badge bg-primary rounded-pill">
              <FaUserFriends className="me-1" />
              {followers.length}
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="search-bar bg-light rounded p-2 mb-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <FiSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder="Search followers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredFollowers.length === 0 ? (
            <div className="alert alert-info">
              {searchTerm ? "No matching followers found" : "No followers found"}
            </div>
          ) : (
            <div className="list-group">
              {filteredFollowers.map((user) => (
                <div key={user.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link 
                      to={`/organizer/${user.id}`} 
                      className="text-decoration-none d-flex align-items-center flex-grow-1"
                    >
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="rounded-circle me-3"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1 text-dark">{user.name}</h5>
                        <small className="text-muted">{user.email}</small>
                      </div>
                    </Link>
                    {userId === userId && (
                      <button
                        onClick={() => handleUnfollow(user.id)}
                        className="btn btn-sm btn-outline-danger ms-3"
                      >
                        <FaTimes className="me-1" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </>
  );
};

export default FollowersPage;