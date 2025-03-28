import React, { useEffect } from "react";

const Loader = () => {
	useEffect(() => {
		window.onload = () => {
			document.body.classList.add("loaded");
		};
	}, []);

	return (
		<div id="loader-wrapper">
			<div id="loader"></div>
			<div className="loader-section section-left"></div>
			<div className="loader-section section-right"></div>
		</div>
	);
};

export default Loader;
