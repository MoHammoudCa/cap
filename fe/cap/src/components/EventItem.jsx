import React from "react";
import { Link } from "react-router-dom";

const EventItem = ({ event }) => {
	console.log(event);

	return (
		<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
			<figure className="effect-ming tm-video-item">
				<img src={`${event.image}`} alt="Image" className="img-fluid" />
				<figcaption className="d-flex align-items-center justify-content-center">
					<h2>{event.title}</h2>
					<Link to={`/event/${event.id}`}>View more</Link>
				</figcaption>
			</figure>
			<div className="d-flex justify-content-between tm-text-gray">
				<span className="tm-text-gray-light">{event.date}</span>
				<span>{event.views} views</span>
			</div>
		</div>
	);
};

export default EventItem;
