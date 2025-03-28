import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PhotoDetail from "../components/PhotoDetail";
import RelatedPhotos from "../components/RelatedPhotos";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const PhotoDetailPage = () => {
	return (
		<>
			<Loader />
			<Navbar />
			<Hero />
			<PhotoDetail />
			<RelatedPhotos />
			<Footer />
		</>
	);
};

export default PhotoDetailPage;
