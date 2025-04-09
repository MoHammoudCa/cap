import { Parallax } from "react-parallax";

const Hero = () => {
	return (
		<Parallax
			blur={{ min: -15, max: 15 }}
			bgImage="/src/assets/img/hero.jpg"
			bgImageAlt="Hero background"
			strength={200}
			className="tm-hero d-flex justify-content-center align-items-center"
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
		</Parallax>
	);
};

export default Hero;
