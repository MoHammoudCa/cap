import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Events from "../components/Events";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import SearchAndFilter from "../components/Search&Filter";

const Home = () => {
	const [finalEvents, setFinalEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	return (
		<>
			<Loader />
			<Navbar />
			<Hero />
			<SearchAndFilter
				setFinalEvents={setFinalEvents}
				setLoading={setLoading}
				setError={setError}
			/>
			<Events finalEvents={finalEvents} loading={loading} error={error} />
			<Footer />
		</>
	);
};

export default Home;
