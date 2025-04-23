import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import Navbar from "../components/Navbar";

const AddEvent = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		date: "",
		categories: "",
		image: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);

	const categories = [
		"Music",
		"Sports",
		"Arts",
		"Business",
		"Food",
		"Technology",
		"Education",
		"Health",
		"Other",
	];

	const handleCategoryChange = (category) => {
		setSelectedCategories((prev) => {
			if (prev.includes(category)) {
				return prev.filter((c) => c !== category);
			} else {
				return [...prev, category];
			}
		});

		setFormData((prev) => ({
			...prev,
			categories: selectedCategories.includes(category)
				? selectedCategories.filter((c) => c !== category).join(",")
				: [...selectedCategories, category].join(","),
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);

		setIsSubmitting(true);
		try {
			const imgbbUrl = `https://api.imgbb.com/1/upload?key=b76b2619b45c9ba98787c8a173723e7c`;
			const formData = new FormData();
			formData.append("image", file);

			const response = await fetch(imgbbUrl, {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			console.log(data.data.url);

			if (!data.success) throw new Error("Image upload failed");

			setFormData((prev) => ({ ...prev, image: data.data.url }));
		} catch (error) {
			console.error("Image upload error:", error);
			setErrors({ image: "Failed to upload image" });
		} finally {
			setIsSubmitting(false);
		}
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.title.trim()) newErrors.title = "Title is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		if (!formData.location.trim()) newErrors.location = "Location is required";
		if (!formData.date) newErrors.date = "Date is required";
		if (!formData.categories) newErrors.categories = "Category is required";
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await api.post("/events", JSON.stringify(formData));
			// const response = await fetch("http://localhost:8080/api/events", {
			// 	method: "POST",
			// 	headers: { "Content-Type": "application/json" },
			// 	body: JSON.stringify(formData),
			// 	credentials: "include",
			// });

			if (response.status !== 200) throw new Error("Failed to create event");
			navigate("/my-events");
		} catch (error) {
			console.error("Error:", error);
			setErrors({ submit: error.message });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Navbar />
			<div className="add-event-container">
				<h1>Create New Event</h1>
				<form onSubmit={handleSubmit} className="event-form">
					{errors.submit && (
						<div className="error-message">{errors.submit}</div>
					)}{" "}
					<div className="form-group">
						<label htmlFor="title">Event Title*</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className={errors.title ? "error" : ""}
						/>
						{errors.title && (
							<span className="error-message">{errors.title}</span>
						)}
					</div>
					<div className="form-group">
						<label htmlFor="description">Description*</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							rows="4"
							className={errors.description ? "error" : ""}
						/>
						{errors.description && (
							<span className="error-message">{errors.description}</span>
						)}
					</div>
					<div className="form-group">
						<label htmlFor="location">Location*</label>
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							className={errors.location ? "error" : ""}
						/>
						{errors.location && (
							<span className="error-message">{errors.location}</span>
						)}
					</div>
					<div className="form-group">
						<label htmlFor="date">Date and Time*</label>
						<input
							type="datetime-local"
							id="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							className={errors.date ? "error" : ""}
						/>
						{errors.date && (
							<span className="error-message">{errors.date}</span>
						)}
					</div>
					<div className="form-group">
						<label>Categories*</label>
						<div className="categories-container">
							{categories.map((category) => (
								<div
									key={category}
									className={`category-chip ${
										selectedCategories.includes(category) ? "selected" : ""
									}`}
									onClick={() => handleCategoryChange(category)}
								>
									{category}
								</div>
							))}
						</div>
						{errors.categories && (
							<span className="error-message">{errors.categories}</span>
						)}
					</div>
					<div className="form-group">
						<label htmlFor="image">Event Image</label>
						<input
							type="file"
							id="image"
							name="image"
							accept="image/*"
							onChange={handleImageChange}
							disabled={isSubmitting}
						/>
						{errors.image && (
							<span className="error-message">{errors.image}</span>
						)}
						{imagePreview && (
							<div className="image-preview">
								<img
									className="image-previewTag"
									src={imagePreview}
									alt="Preview"
								/>
								{formData.image && (
									<span className="upload-success">
										✓ Image uploaded successfully
									</span>
								)}
							</div>
						)}
					</div>
					<div className="form-actions">
						<button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create Event"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default AddEvent;
