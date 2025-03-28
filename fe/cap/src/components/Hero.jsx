const Hero = () => {
	return (
		<div
			className="tm-hero d-flex justify-content-center align-items-center"
			data-parallax="scroll"
			data-image-src="/src/assets/img/hero.jpg"
		>
			<form className="d-flex tm-search-form">
				<input
					className="form-control tm-search-input"
					type="search"
					placeholder="Search"
					aria-label="Search"
				/>
				<button className="btn btn-outline-success tm-search-btn" type="submit">
					<i className="fas fa-search"></i>
				</button>
			</form>
		</div>
	);
};

export default Hero;

// import heroImage from "../assets/img/hero.jpg";

// const Hero = () => {
// 	return (
// 		<div
// 			className="tm-hero d-flex justify-content-center align-items-center"
// 			style={{
// 				backgroundImage: `url(${heroImage})`,
// 				backgroundSize: "cover",
// 				backgroundPosition: "center",
// 			}}
// 		>
// 			<form className="d-flex tm-search-form">
// 				<input
// 					className="form-control tm-search-input"
// 					type="search"
// 					placeholder="Search"
// 					aria-label="Search"
// 				/>
// 				<button className="btn btn-outline-success tm-search-btn" type="submit">
// 					<i className="fas fa-search"></i>
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default Hero;
