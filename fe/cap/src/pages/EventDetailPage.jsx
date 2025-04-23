import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RelatedPhotos from "../components/RelatedPhotos";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import EventDetail from "../components/EventDetail";
import { useParams } from "react-router-dom";

const EventDetailPage = () => {
	// const { id } = useParams();

	

	return (
		<>
			{/* <Loader /> */}
			<Navbar />
			<Hero />
			<EventDetail />
			{/* <RelatedPhotos /> */}
			<Footer />
		</>
	);
};

export default EventDetailPage;
