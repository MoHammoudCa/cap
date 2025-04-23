import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import MyEventsComp from "../components/MyEventsComp";
import FloatingButton from "../components/FloatingButton";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/add-event");
	};

	return (
		<>
			<Loader />
			<Navbar />
			<Hero />
			<MyEventsComp />
			<FloatingButton onClick={handleClick} />
			<Footer />
		</>
	);
};
// test
export default MyEvents;
