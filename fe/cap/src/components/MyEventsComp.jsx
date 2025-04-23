import React, { useState, useEffect } from "react";
import EventItem from "./EventItem";
import SearchAndFilter from "./Search&Filter";
import axios from "axios";

const MyEventsComp = () => {
	const userId = JSON.parse(localStorage.getItem("user"))?.id;
	const [originalEvents, setOriginalEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const normalizeEvent = (event) => {
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

	useEffect(() => {
		const fetchEvents = async () => {
			setLoading(true);
			setError(null);
			try {
				if (!userId) {
					throw new Error("User not logged in");
				}

				const response = await axios.get(
					`http://localhost:8080/api/events/user/${userId}`
				);

				const normalizedEvents = Array.isArray(response.data)
					? response.data.map(normalizeEvent)
					: [];

				setOriginalEvents(normalizedEvents);
				setFilteredEvents(normalizedEvents);
			} catch (err) {
				setError(err.message);
				console.error("Error fetching user events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, [userId]);

	if (loading) {
		return <div>Loading events...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container-fluid tm-container-content tm-mt-60">
			<SearchAndFilter
				events={originalEvents}
				setFilteredEvents={setFilteredEvents}
				setLoading={setLoading}
				setError={setError}
			/>

			<div className="row tm-mb-90 tm-gallery">
				{filteredEvents.length > 0 ? (
					filteredEvents.map((event) => (
						<EventItem key={event.id} event={event} />
					))
				) : (
					<div className="col-12">
						<p>No events found matching your criteria.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyEventsComp;
