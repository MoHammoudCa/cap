import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaUserFriends, FaTimes, FaUserTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const EventAttendeesPage = () => {
    const { id } = useParams();
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    const [attendees, setAttendees] = useState([]);
    const [filteredAttendees, setFilteredAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [eventDetails, setEventDetails] = useState(null);
    console.log(id)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [eventRes, attendeesRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/events/${id}`),
                    axios.get(`http://localhost:8080/api/attendees/event/${id}`)
                ]);
                
                setEventDetails(eventRes.data);
                
                const attendeesWithDetails = await Promise.all(
                    attendeesRes.data.map(async (attendee) => {
                        const userResponse = await axios.get(`http://localhost:8080/api/users/${attendee.user.id}`);
                        return { ...userResponse.data, attendeeId: attendee.id }; // Include attendee ID for removal
                    })
                );
                
                setAttendees(attendeesWithDetails);
                setFilteredAttendees(attendeesWithDetails);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const filtered = attendees.filter(user => 
                user.name.toLowerCase().includes(term) || 
                (user.email && user.email.toLowerCase().includes(term))
            );
            setFilteredAttendees(filtered);
        } else {
            setFilteredAttendees(attendees);
        }
    }, [searchTerm, attendees]);

    const handleRemoveAttendee = async (attendeeId, userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/attendees`, {
                params: { userId, eventId: id }
            });
            // Remove the attendee from both lists
            setAttendees(attendees.filter(user => user.id !== userId));
            setFilteredAttendees(filteredAttendees.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error removing attendee:", error);
            alert("Failed to remove attendee");
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
                            <h2 className="tm-text-primary mb-0 me-2">
                                Attendees for: {eventDetails?.title || "Event"}
                            </h2>
                            <span className="badge bg-primary rounded-pill">
                                <FaUserFriends className="me-1" />
                                {attendees.length}
                                {eventDetails?.capacity && `/${eventDetails.capacity}`}
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
                                    placeholder="Search attendees by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {filteredAttendees.length === 0 ? (
                            <div className="alert alert-info">
                                {searchTerm ? "No matching attendees found" : "No attendees yet"}
                            </div>
                        ) : (
                            <div className="list-group">
                                {filteredAttendees.map((user) => (
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
                                            {eventDetails?.organizer?.id === userId && (
                                                <button
                                                    onClick={() => handleRemoveAttendee(user.attendeeId, user.id)}
                                                    className="btn btn-sm btn-outline-danger ms-3"
                                                >
                                                    <FaUserTimes className="me-1" /> Remove
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
        </>
    );
};

export default EventAttendeesPage;