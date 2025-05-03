import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { parseISO, isAfter, isBefore, format } from "date-fns";

const AttendancePage = () => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [attendanceEvents, setAttendanceEvents] = useState([]);
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
    const fetchAttendanceEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/attendees/user/${userId}/ended`
                );

        // Add status to each event
        const eventsWithStatus = response.data.map(attendance => ({
          ...attendance,
          event: {
            ...attendance.event,
            statusInfo: attendance.event.date ? getEventStatus(attendance.event.date) : {
              status: "Unknown",
              badgeClass: "bg-secondary"
            }
          }
        }));

        setAttendanceEvents(eventsWithStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceEvents();
  }, [userId, token]);

  if (loading) return <div className="text-center py-5">Loading attendance events...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="container-fluid tm-container-content tm-mt-60 px-3 px-md-4 px-lg-5">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-4">
              <h2 className="tm-text-primary mb-0 me-2">Attendance Events</h2>
              <span className="badge bg-primary rounded-pill">
                <FaCheckCircle className="me-1" />
                {attendanceEvents.length}
              </span>
            </div>

            {attendanceEvents.length === 0 ? (
              <div className="alert alert-info">
                No attendance events found.
              </div>
            ) : (
              <div className="row tm-mb-90 tm-gallery">
                {attendanceEvents.map((attendance) => (
                  <div key={attendance.event.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                    <div className="card h-100 shadow-sm d-flex flex-column">
                      <img
                        src={attendance.event.image || "/default-event.jpg"}
                        alt={attendance.event.title}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0">{attendance.event.title}</h5>
                          <span className={`badge ${attendance.event.statusInfo.badgeClass}`}>
                            {attendance.event.statusInfo.status}
                          </span>
                        </div>

                        {attendance.event.organizer && (
                          <div className="d-flex align-items-center mb-3">
                            <Link
                              to={`/organizer/${attendance.event.organizer.id}`}
                              className="text-decoration-none d-flex align-items-center"
                            >
                              <img
                                src={
                                  attendance.event.organizer.profilePicture ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(attendance.event.organizer.name)}&background=random`
                                }
                                alt={attendance.event.organizer.name}
                                className="rounded-circle me-2"
                                style={{ width: "30px", height: "30px", objectFit: "cover" }}
                              />
                              <span className="text-muted small">
                                Hosted by <strong>{attendance.event.organizer.name}</strong>
                              </span>
                            </Link>
                          </div>
                        )}

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to={`/event/${attendance.event.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Details
                            </Link>
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

export default AttendancePage;