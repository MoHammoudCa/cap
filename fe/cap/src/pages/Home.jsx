import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const Home = () => {
	return (
		<>
			<Loader />
			<Navbar />
			<Hero />
			<Gallery />
			<Footer />
		</>
	);
};

export default Home;
