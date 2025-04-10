import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Events from "../components/Events";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const Home = () => {
	return (
		<>
			<Loader />
			<Navbar />
			<Hero />
			<Events />
			<Footer />
		</>
	);
};

export default Home;
