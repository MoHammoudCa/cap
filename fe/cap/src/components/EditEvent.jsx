import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import '../assets/css/addEvent.css';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
        categories: "",
        image: "",
        capacity: "",
        price: ""
        });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        "Music", "Sports", "Arts", "Business", "Food", 
        "Technology", "Education", "Health", "Other"
    ];


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                const event = response.data;
                
                setFormData({
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
                    categories: event.categories,
                    image: event.image,
                    capacity: event.capacity,
                    price: event.price
                                });

                if (event.categories) {
                    setSelectedCategories(
                        typeof event.categories === 'string' 
                            ? event.categories.split(',') 
                            : event.categories
                    );
                }

                if (event.image) {
                    setImagePreview(event.image);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                navigate('/my-events');
            }
        };

        fetchEvent();
    }, [id, navigate]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category];
            
            setFormData(prev => ({
                ...prev,
                categories: newCategories.join(',')
            }));
            
            return newCategories;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
            if (!data.success) throw new Error("Image upload failed");

            setFormData(prev => ({ ...prev, image: data.data.url }));
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
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.categories) newErrors.categories = "At least one category is required";
        if (!formData.capacity) newErrors.capacity = "Capacity is required";
        else if (isNaN(formData.capacity)) newErrors.capacity = "Must be a number";
        if (!formData.price) newErrors.price = "Price is required";
        else if (isNaN(formData.price)) newErrors.price = "Must be a number";
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
            const response = await api.put(`/events/${id}`, {
                ...formData,
                capacity: parseInt(formData.capacity),
                price: parseFloat(formData.price)
            });

            if (response.status !== 200) throw new Error("Failed to update event");
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
                <h1>Edit Event</h1>
                <form onSubmit={handleSubmit} className="event-form">
                    {errors.submit && (
                        <div className="alert alert-danger">{errors.submit}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">Event Title*</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={errors.title ? "is-invalid" : ""}
                        />
                        {errors.title && (
                            <div className="invalid-feedback">{errors.title}</div>
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
                            className={errors.description ? "is-invalid" : ""}
                        />
                        {errors.description && (
                            <div className="invalid-feedback">{errors.description}</div>
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
                            className={errors.location ? "is-invalid" : ""}
                        />
                        {errors.location && (
                            <div className="invalid-feedback">{errors.location}</div>
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
                            className={errors.date ? "is-invalid" : ""}
                        />
                        {errors.date && (
                            <div className="invalid-feedback">{errors.date}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Categories*</label>
                        <div className="categories-container">
                            {categories.map(category => (
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
                            <div className="invalid-feedback d-block">{errors.categories}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="capacity">Capacity*</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            min="1"
                            className={errors.capacity ? "is-invalid" : ""}
                        />
                        {errors.capacity && (
                            <div className="invalid-feedback">{errors.capacity}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price*</label>
                        <div className="input-group">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                            />
                        </div>
                        {errors.price && (
                            <div className="invalid-feedback">{errors.price}</div>
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
                            <div className="invalid-feedback">{errors.image}</div>
                        )}
                        {imagePreview && (
                            <div className="image-preview mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="img-thumbnail"
                                    style={{ maxHeight: '200px' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Updating...
                                </>
                            ) : (
                                "Update Event"
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary ms-2"
                            onClick={() => navigate('/my-events')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditEvent;