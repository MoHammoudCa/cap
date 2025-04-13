import React, { useState, useEffect } from "react";
import EventItem from "./EventItem";
import MyEvents from "../pages/MyEvents";

const MyEventsComp = () => {
	const userId = JSON.parse(localStorage.getItem("user")).id;
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await fetch(
					"http://localhost:8080/api/events/user/" + userId
				);
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
			<div className="row tm-mb-90 tm-gallery">
				{events.map((event) => (
					<EventItem key={event.id} event={event} />
				))}
			</div>
		</div>
	);
};

export default MyEventsComp;
