import React, { useState, useEffect } from "react";
import {
	FiSearch,
	FiFilter,
	FiHeart,
	FiUserCheck,
	FiCalendar,
	FiChevronDown,
	FiChevronUp,
} from "react-icons/fi";
import axios from "axios";

const SearchAndFilter = ({ setFinalEvents, setLoading, setError }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [events, setEvents] = useState([]);
	// const [filteredEvents, setFilteredEvents] = useState([]);
	// const [loading, setLoading] = useState(false);
	// const [error, setError] = useState(null);
	const [showFilters, setShowFilters] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [filterFollowing, setFilterFollowing] = useState(false);
	const [filterLiked, setFilterLiked] = useState(false);
	const [sortDate, setSortDate] = useState(null);

	// Base categories - adjust according to your Event model
	const baseCategories = [
		{ id: "Music", name: "Music" },
		{ id: "Sports", name: "Sports" },
		{ id: "Arts", name: "Arts" },
		{ id: "Business", name: "Business" },
		{ id: "Food", name: "Food" },
		{ id: "Technology", name: "Technology" },
		{ id: "Education", name: "Education" },
		{ id: "Health", name: "Health" },
		{ id: "Other", name: "Other" },
	];

	// Normalize event data from API
	const normalizeEvent = (event) => {
		// Convert categories string to array
		const categories =
			typeof event?.categories === "string"
				? event.categories
						.split(",")
						.map((item) => item.trim())
						.filter(Boolean)
				: [];

		return {
			id: event?.id || `event-${Math.random().toString(36).substr(2, 9)}`,
			title: event?.title || "Untitled Event",
			description: event?.description || "",
			date: event?.date || null,
			isFollowing: Boolean(event?.isFollowing),
			isLiked: Boolean(event?.isLiked),
			categories,
		};
	};

	// Fetch events from backend
	const fetchEvents = async (query = "") => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				`http://localhost:8080/api/events/search/${query}`
			);

			// Normalize all events from API
			const normalizedEvents = Array.isArray(response.data)
				? response.data.map(normalizeEvent)
				: [];

			setEvents(normalizedEvents);
			// setFilteredEvents(normalizedEvents);
			setFinalEvents(normalizedEvents);
			setLoading(false);
		} catch (err) {
			setError(err.message);
			console.error("Error fetching events:", err);
			setEvents([]);
			setFinalEvents([]);
			// setFilteredEvents([]);
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch on component mount
	useEffect(() => {
		fetchEvents();
	}, []);

	// Handle search submission
	const handleSearch = (e) => {
		e.preventDefault();
		fetchEvents(searchTerm);
	};

	// Apply client-side filters
	useEffect(() => {
		let result = [...events];

		// Apply category filter if any selected
		if (selectedCategories.length > 0) {
			result = result.filter((event) =>
				event.categories.some((cat) => selectedCategories.includes(cat))
			);
		}

		// Apply following filter
		if (filterFollowing) {
			result = result.filter((event) => event.isFollowing);
		}

		// Apply liked filter
		if (filterLiked) {
			result = result.filter((event) => event.isLiked);
		}

		// Apply date sorting
		if (sortDate) {
			result.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return sortDate === "asc" ? dateA - dateB : dateB - dateA;
			});
		}

		// setFilteredEvents(result);
		setFinalEvents(result);
	}, [events, selectedCategories, filterFollowing, filterLiked, sortDate]);

	const toggleCategory = (categoryId) => {
		setSelectedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		);
	};

	return (
		<div className="search-filter-container">
			{/* Search Bar with form submission */}
			<form className="search-bar" onSubmit={handleSearch}>
				<FiSearch className="search-icon" />
				<input
					type="text"
					placeholder="Search events..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button
					type="button"
					className="filter-toggle"
					onClick={() => setShowFilters(!showFilters)}
				>
					<FiFilter />
					{showFilters ? <FiChevronUp /> : <FiChevronDown />}
				</button>
			</form>

			{/* Loading and error states */}
			{/* {loading && <div className="loading">Loading events...</div>}
			{error && <div className="error">Error: {error}</div>} */}

			{/* Filters Panel */}
			{showFilters && (
				<div className="filters-panel">
					<div className="filter-section">
						<h4>Categories</h4>
						<div className="category-bubbles">
							{baseCategories.map((category) => (
								<button
									key={category.id}
									type="button"
									className={`category-bubble ${
										selectedCategories.includes(category.id) ? "active" : ""
									}`}
									onClick={() => toggleCategory(category.id)}
								>
									{category.name}
								</button>
							))}
						</div>
					</div>

					<div className="filter-section">
						<label className="filter-checkbox">
							<input
								type="checkbox"
								checked={filterFollowing}
								onChange={() => setFilterFollowing(!filterFollowing)}
							/>
							<FiUserCheck className="filter-icon" />
							Following Only
						</label>
					</div>

					<div className="filter-section">
						<label className="filter-checkbox">
							<input
								type="checkbox"
								checked={filterLiked}
								onChange={() => setFilterLiked(!filterLiked)}
							/>
							<FiHeart className="filter-icon" />
							Liked Only
						</label>
					</div>

					<div className="filter-section">
						<h4>Sort by Date</h4>
						<div className="sort-options">
							<button
								type="button"
								className={`sort-button ${sortDate === "asc" ? "active" : ""}`}
								onClick={() => setSortDate(sortDate === "asc" ? null : "asc")}
							>
								<FiCalendar /> Oldest First
							</button>
							<button
								type="button"
								className={`sort-button ${sortDate === "desc" ? "active" : ""}`}
								onClick={() => setSortDate(sortDate === "desc" ? null : "desc")}
							>
								<FiCalendar /> Newest First
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Results */}
			{/* <div className="results-container">
				{filteredEvents.length > 0
					? filteredEvents.map((event) => (
							<div key={event.id} className="result-item">
								<h3>{event.title}</h3>
								<p>
									{event.description.substring(0, 100)}
									{event.description.length > 100 ? "..." : ""}
								</p>
								<div className="item-meta">
									<span>
										{event.date
											? new Date(event.date).toLocaleDateString()
											: "No date specified"}
									</span>
									{event.categories.map((catId) => {
										const cat = baseCategories.find((c) => c.id === catId);
										return cat ? (
											<span
												key={`${event.id}-${catId}`}
												className="item-category"
											>
												{cat.name}
											</span>
										) : null;
									})}
								</div>
							</div>
					  ))
					: !loading && (
							<p className="no-results">
								No events found. Try adjusting your search or filters.
							</p>
					  )}
			</div> */}
		</div>
	);
};

export default SearchAndFilter;
