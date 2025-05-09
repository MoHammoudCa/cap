import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { Parallax } from "react-parallax";

const About = () => {
	return (
		<>
			<Navbar />

			<div className="container-fluid tm-mt-60">
				<div className="row mb-4">
					<h2 className="col-12 tm-text-primary">
						About Fun.LB - Lebanon's Event Hub
					</h2>
				</div>
				<div className="row tm-mb-74 tm-row-1640">
					<div className="col-lg-5 col-md-6 col-12 mb-3">
						<img
							src="https://i.ibb.co/9mWLbrWL/My-Pic-zoomed.jpg"
							alt="Fun.LB team"
							className="img-fluid"
							style={{width : '90%', height : 'auto' }}
						/>
					</div>
					<div className="col-lg-7 col-md-6 col-12">
						<div className="tm-about-img-text">
							<p className="mb-4">
								<strong>Fun.LB</strong> is Lebanon's premier event discovery and management platform, 
								born out of a passion for bringing people together through memorable experiences. 
								Our mission is to transform how Lebanese residents and visitors discover, 
								participate in, and organize events across the country.
							</p>
							<p className="mb-4">
								Founded in 2024 by Mohammad Hammoud, Fun.LB addresses the fragmented 
								event discovery landscape in Lebanon by providing a centralized, 
								AI-powered platform that connects event organizers with their target audiences.
							</p>
							<p>
								We believe in the power of community and shared experiences to 
								strengthen social bonds and create lasting memories. Whether you're 
								looking for cultural events, music festivals, business conferences, 
								or local meetups, Fun.LB is your gateway to Lebanon's vibrant event scene.
							</p>
						</div>
					</div>
				</div>
				
				{/* Our Mission Section */}
				<div className="row tm-mb-50">
					<div className="col-12 text-center mb-5">
						<h2 className="tm-text-primary">Our Core Values</h2>
					</div>
					<div className="col-md-4 col-12">
						<div className="tm-about-3-col">
							<div className="tm-about-icon-container mb-5">
								<i className="fas fa-users fa-3x tm-text-primary"></i>
							</div>
							<h2 className="tm-text-primary mb-4">Community First</h2>
							<p className="mb-4">
								We prioritize building genuine connections between event organizers 
								and attendees, fostering a vibrant event ecosystem in Lebanon.
							</p>
						</div>
					</div>
					<div className="col-md-4 col-12">
						<div className="tm-about-3-col">
							<div className="tm-about-icon-container mb-5">
								<i className="fas fa-lightbulb fa-3x tm-text-primary"></i>
							</div>
							<h2 className="tm-text-primary mb-4">Innovation Driven</h2>
							<p className="mb-4">
								Leveraging cutting-edge AI technology to simplify event discovery 
								and management while delivering personalized experiences.
							</p>
						</div>
					</div>
					<div className="col-md-4 col-12">
						<div className="tm-about-3-col">
							<div className="tm-about-icon-container mb-5">
								<i className="fas fa-map-marked-alt fa-3x tm-text-primary"></i>
							</div>
							<h2 className="tm-text-primary mb-4">Local Focus</h2>
							<p className="mb-4">
								Dedicated to showcasing Lebanon's rich cultural diversity through 
								events that celebrate our heritage and contemporary creativity.
							</p>
						</div>
					</div>
				</div>
				
				{/* Services Section */}
				<div className="row tm-mb-50">
					<div className="col-12 text-center mb-5">
						<h2 className="tm-text-primary">Our Services</h2>
					</div>
					<div className="col-md-6 col-12">
						<div className="tm-about-2-col">
							<h2 className="tm-text-primary mb-4">
								For Event Attendees
							</h2>
							<ul className="tm-service-list">
								<li>AI-powered personalized event recommendations</li>
								<li>Comprehensive event search with smart filters</li>
								<li>Interactive maps with directions to event locations</li>
								<li>Calendar integration and reminder system</li>
								<li>Verified event reviews and ratings</li>
								<li>Real-time notifications for event updates</li>
							</ul>
						</div>
					</div>
					<div className="col-md-6 col-12">
						<div className="tm-about-2-col">
							<h2 className="tm-text-primary mb-4">
								For Event Organizers
							</h2>
							<ul className="tm-service-list">
								<li>Easy event creation and management tools</li>
								<li>AI-assisted event description and poster generation</li>
								<li>Targeted audience reach and analytics</li>
								<li>Organizer verification for credibility</li>
								<li>Ticket management and attendee tracking</li>
								<li>Emergency notification system</li>
							</ul>
						</div>
					</div>
				</div>
				
				
				{/* Call to Action */}
				<div className="row tm-mb-50">
					<div className="col-12 text-center">
						<h2 className="tm-text-primary mb-4">Join the Fun.LB Community</h2>
						<p className="mb-4">
							Whether you're looking to discover amazing events or promote your own, 
							Fun.LB is your ultimate event platform in Lebanon.
						</p>
						<a href="/signup" className="btn btn-primary tm-btn-big">
							Get Started Now
						</a>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default About;