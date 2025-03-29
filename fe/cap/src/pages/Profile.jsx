import React from "react";
import Navbar from "../components/Navbar";

const Profile = ({ user }) => {
	const { id, name, email, role, profile_picture, created_at } = user;

	const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<>
			<Navbar />
			<div className="profile-container">
				<div className="profile-card">
					<div className="profile-header">
						<div className="avatar-container">
							<img
								src={
									profile_picture ||
									"https://ui-avatars.com/api/?name=" +
										encodeURIComponent(name) +
										"&background=random"
								}
								alt={name}
								className="profile-avatar"
							/>
						</div>
						<h2 className="profile-name">{name}</h2>
						<p className="profile-role">{role.toLowerCase()}</p>
					</div>

					<div className="profile-details">
						<div className="detail-item">
							<span className="detail-label">Email:</span>
							<span className="detail-value">{email}</span>
						</div>

						<div className="detail-item">
							<span className="detail-label">User ID:</span>
							<span className="detail-value">{id}</span>
						</div>

						<div className="detail-item">
							<span className="detail-label">Member since:</span>
							<span className="detail-value">{formattedDate}</span>
						</div>
					</div>

					<div className="profile-actions">
						<button className="edit-button">Edit Profile</button>
						{role === "ADMIN" && (
							<button className="admin-button">Admin Panel</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Profile;
