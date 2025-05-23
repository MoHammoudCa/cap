import React from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import '../assets/css/footer.css';

const Footer = () => {
  return (
    <footer className="tm-bg-gray pt-5 pb-3 tm-text-gray tm-footer">
      <div className="container-fluid tm-container-small">
        <div className="row">
          {/* About Fun.LB */}
          <div className="col-lg-5 col-md-12 col-12 px-5 mb-5">
            <h3 className="tm-text-primary mb-4 tm-footer-title">About Fun.LB</h3>
            <p className="mb-4">
              Lebanon's premier event discovery platform connecting people with unforgettable experiences.
              From cultural festivals to business conferences, we bring Lebanon's vibrant event scene to your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 col-sm-6 col-12 px-5 mb-5">
            <h3 className="tm-text-primary mb-4 tm-footer-title">Quick Links</h3>
            <ul className="tm-footer-links pl-0">
              <li className="mb-2">
                <Link to="/" className="tm-text-light">Browse Events</Link>
              </li>
              <li className="mb-2">
                <Link to="/add-event" className="tm-text-light">Host an Event</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="tm-text-light">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="col-lg-4 col-md-6 col-sm-6 col-12 px-5 mb-5">
            <h3 className="tm-text-primary mb-4 tm-footer-title">Connect With Us</h3>
            <ul className="tm-contact-info pl-0 mb-4">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Beirut, Lebanon
              </li>
              <li className="mb-2">
                <i className="fas fa-phone mr-2"></i>
                +961 70 554 528
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope mr-2"></i>
                info@funlb.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="col-lg-8 col-md-7 col-12 px-5 mb-3">
          &copy; {new Date().getFullYear()} Fun.LB - All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;