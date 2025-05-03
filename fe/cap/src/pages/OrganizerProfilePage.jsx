import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import OrganizerProfile from "../components/OrganizerProfile";

const OrganizerProfilePage = () => {
  return (
    <>
      <Navbar />
      <OrganizerProfile />
      <Footer />
    </>
  );
};

export default OrganizerProfilePage;