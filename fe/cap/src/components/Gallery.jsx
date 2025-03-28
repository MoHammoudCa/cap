import React from "react";
import GalleryItem from "./GalleryItem";
import Pagination from "./Pagination";

const Gallery = () => {
	const photos = [
		{
			id: 1,
			src: "/src/assets/img/img-03.jpg",
			title: "Clocks",
			date: "18 Oct 2020",
			views: "9,906",
		},
		{
			id: 2,
			src: "/src/assets/img/img-04.jpg",
			title: "Plants",
			date: "14 Oct 2020",
			views: "16,100",
		},
		// Add more photo data here
	];

	return (
		<div className="container-fluid tm-container-content tm-mt-60">
			<div className="row mb-4">
				<h2 className="col-6 tm-text-primary">Latest Photos</h2>
				<div className="col-6 d-flex justify-content-end align-items-center">
					<form action="" className="tm-text-primary">
						Page{" "}
						<input
							type="text"
							value="1"
							size="1"
							className="tm-input-paging tm-text-primary"
						/>{" "}
						of 200
					</form>
				</div>
			</div>
			<div className="row tm-mb-90 tm-gallery">
				{photos.map((photo) => (
					<GalleryItem key={photo.id} photo={photo} />
				))}
			</div>
			<Pagination />
		</div>
	);
};

export default Gallery;
