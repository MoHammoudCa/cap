import React from "react";
import GalleryItem from "./GalleryItem";

const RelatedPhotos = () => {
	const relatedPhotos = [
		{
			id: 1,
			src: "/src/assets/img/img-01.jpg",
			title: "Hangers",
			date: "16 Oct 2020",
			views: "12,460",
		},
		{
			id: 2,
			src: "/src/assets/img/img-02.jpg",
			title: "Perfumes",
			date: "12 Oct 2020",
			views: "11,402",
		},
		{
			id: 3,
			src: "/src/assets/img/img-03.jpg",
			title: "Clocks",
			date: "8 Oct 2020",
			views: "9,906",
		},
		{
			id: 4,
			src: "/src/assets/img/img-04.jpg",
			title: "Plants",
			date: "6 Oct 2020",
			views: "16,100",
		},
	];

	return (
		<div className="container-fluid tm-container-content tm-mt-60">
			<div className="row mb-4">
				<h2 className="col-12 tm-text-primary">Related Photos</h2>
			</div>
			<div className="row mb-3 tm-gallery">
				{relatedPhotos.map((photo) => (
					<GalleryItem key={photo.id} photo={photo} />
				))}
			</div>
		</div>
	);
};

export default RelatedPhotos;
