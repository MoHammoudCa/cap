import React from "react";
import { Link } from "react-router-dom";

const EventItem = ({ event }) => {
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	};

	const formatTime = (dateString) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// const categories = event.categories?.split(",").map((item) => item.trim());

	// console.log(event);	
	return (
		<>
			{/* <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
				<figure className="effect-ming tm-video-item">
					{!event.image ? (
						<img
							src="/src/assets/img/defaultEventImage.png"
							alt="Default event image"
							className="img-fluid"
						/>
					) : (
						<img src={event.image} alt="Event" className="img-fluid" />
					)}
					<figcaption className="d-flex align-items-center justify-content-center">
						<h2>{event.title}</h2>
						<Link to={`/event/${event.id}`}>View more</Link>
					</figcaption>
				</figure>
				<div className="d-flex justify-content-between tm-text-gray">
					<span className="tm-text-gray-light">{event.date}</span>
					<span>{event.views} views</span>
				</div>
			</div> */}
			<div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
				<div className="card">
					{!event.image ? (
						<img
							src="/src/assets/img/defaultEventImage.png"
							alt="Default event image"
							className="card-img-top"
						/>
					) : (
						<img src={event.image} alt="Event" className="img-fluid" />
					)}
					<div className="card-body">
						<h5 className="card-title">{event.title}</h5>
						{/* <p className="card-text">Some quick example text...</p> */}
						{event.organizer && (
							<p>
								<i className="fa-regular fa-user"></i> {event.organizer.name}
							</p>
						)}
						{event.date && (
							<>
								<p>
									<i className="fa-solid fa-calendar-days"></i>{" "}
									{formatDate(event.date)}
								</p>
								<p>
									<i className="fa-solid fa-clock"></i> {formatTime(event.date)}
								</p>
							</>
						)}

						{event.location && (
							<>
								<p>
									<i className="fa-solid fa-location-dot"></i> {event.location}
								</p>
							</>
						)}

						<p style={{ marginBottom: "10px" }}>
							{event.categories &&
								event.categories?.map((category, index) => (
									<span
										key={index}
										className="badge rounded-pill bg-info text-dark"
										style={{ fontSize: "15px", margin: "5px" }}
									>
										{category}
									</span>
								))}
						</p>
						<div className="row align-items-center g-2">
							<div className="col-md-6 col-12">
								<Link
									to={`/event/${event.id}`}
									className="btn btn-primary w-100 py-2"
								>
									More Details
								</Link>
							</div>

							<div className="col-md-3 col-6 d-flex justify-content-end">
								<button
									className="btn btn-outline-secondary border-0"
									aria-label="Like"
								>
									<i className="fa-regular fa-thumbs-up fa-xl"></i>
								</button>
							</div>

							<div className="col-md-3 col-6 d-flex justify-content-start">
								<button
									className="btn btn-outline-secondary border-0"
									aria-label="Dislike"
								>
									<i className="fa-regular fa-thumbs-down fa-xl"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EventItem;
