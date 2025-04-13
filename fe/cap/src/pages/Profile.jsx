import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

const Profile = () => {
	const userId = JSON.parse(localStorage.getItem("user")).id;
	const [user, setUser] = useState({});
	const { id, name, email, role, profile_picture, created_at } = user;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isHovering, setIsHovering] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/users/${userId}`
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setUser(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [userId]);

	const handleImageClick = () => {
		fileInputRef.current.click();
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type and size
		if (!file.type.match("image.*")) {
			alert("Please select an image file (JPEG, PNG, etc.)");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			// 5MB limit
			alert("Image size should be less than 5MB");
			return;
		}

		await uploadImage(file);
	};

	const uploadImage = async (file) => {
		setIsUploading(true);
		try {
			// Step 1: Upload to imgBB
			const imgbbUrl = `https://api.imgbb.com/1/upload?key=43296ed8e6b7bdb72f75e31281f96904`;
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

			// Step 2: Update user with new profile picture
			const updateResponse = await fetch(
				`http://localhost:8080/api/users/${userId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({
						...user, // Include all current user data
						profile_picture: imageUrl, // Only change the profile picture
					}),
				}
			);

			if (!updateResponse.ok) {
				throw new Error("Failed to update profile");
			}

			// Update local state with new image
			setUser((prev) => ({ ...prev, profile_picture: imageUrl }));
			alert("Profile picture updated successfully!");
		} catch (err) {
			console.error("Error:", err);
			setError(err.message);
			alert("Failed to update profile picture. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	if (loading) {
		return <div>Loading profile...</div>;
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
									profile_picture ||
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
