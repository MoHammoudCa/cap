import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
	const location = useLocation();
	const [unreadCount, setUnreadCount] = useState(0);
	const userId = JSON.parse(localStorage.getItem("user"))?.id;

	// Helper function to check if current path matches the link
	const isActive = (path) => {
		return location.pathname === path;
	};

	useEffect(() => {
		if (userId) {
			const fetchUnreadCount = async () => {
				try {
					const response = await axios.get(`http://localhost:8080/api/messages/unread-count/${userId}`);
					setUnreadCount(response.data);
				} catch (error) {
					console.error("Error fetching unread count:", error);
				}
			};
			fetchUnreadCount();
		}
	}, [userId]);

	return (
		<>
			<div style={{ height: "35px" }}></div>
			<nav className="navbar fixed-top navbar-expand-lg bg-light">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">
						<i className="fas fa-dice mr-2"></i>
						FunLB
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<i className="fas fa-bars"></i>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav ml-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a
									className={`nav-link nav-link-1 ${isActive("/") ? "active" : ""}`}
									href="/"
								>
									Home
								</a>
							</li>
							<li className="nav-item">
								<a
									className={`nav-link nav-link-2 ${isActive("/my-events") ? "active" : ""}`}
									href="/my-events"
								>
									My Events
								</a>
							</li>
							<li className="nav-item">
								<a
									className={`nav-link nav-link-3 ${isActive("/about") ? "active" : ""}`}
									href="/about"
								>
									About
								</a>
							</li>
							<li className="nav-item">
								<a
									className={`nav-link nav-link-4 ${isActive("/profile") ? "active" : ""}`}
									href="/profile"
								>
									Profile
								</a>
							</li>

							{/* Inbox link only if user is logged in */}
							{userId && (
								<li className="nav-item">
									<a
										className={`nav-link nav-link-5 ${isActive("/inbox") ? "active" : ""}`}
										href="/inbox"
									>
										<FaEnvelope className="mr-1" />
										Inbox{" "}
										{unreadCount > 0 && (
											<span className="badge bg-danger">{unreadCount}</span>
										)}
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;