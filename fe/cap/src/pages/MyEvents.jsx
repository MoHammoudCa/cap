import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MyEventsComp from "../components/MyEventsComp";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/add-event");
	};

	return (
		<>
			<Navbar />
			<MyEventsComp />
			<Footer />
		</>
	);
};
// test
export default MyEvents;
