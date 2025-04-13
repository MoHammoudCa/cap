import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhotoDetailPage from "./pages/EventDetailPage";
import LoginSignup from "./pages/LoginSignup";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import EventDetailPage from "./pages/EventDetailPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyEvents from "./pages/MyEvents";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/photo/:id" element={<PhotoDetailPage />} />
				<Route path="/login" element={<LoginSignup />} />
				<Route path="/profile/" element={<Profile />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/add-event" element={<AddEvent />} />
					<Route path="/my-events" element={<MyEvents />} />
				</Route>
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/event/:id" element={<EventDetailPage />} />
			</Routes>
		</Router>
	);
};

export default App;
