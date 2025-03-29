import React, { useState, useEffect } from "react";
import EventItem from "./EventItem";
import Pagination from "./Pagination";

const Events = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch("http://localhost:8080/api/events");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setEvents(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (loading) {
		return <div>Loading events...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container-fluid tm-container-content tm-mt-60">
			<div className="row mb-4">
				<h2 className="col-6 tm-text-primary">Latest Events</h2>
				<div className="col-6 d-flex justify-content-end align-items-center">
					<form action="" className="tm-text-primary">
						Page{" "}
						<input
							type="text"
							value="1"
							size="1"
							className="tm-input-paging tm-text-primary"
						/>{" "}
						of 200
					</form>
				</div>
			</div>
			<div className="row tm-mb-90 tm-gallery">
				{events.map((event) => (
					<EventItem key={event.id} event={event} />
				))}
			</div>
			<Pagination />
		</div>
	);
};

export default Events;
