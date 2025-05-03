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
import LogoutPage from "./pages/logout";
import OrganizerProfilePage from "./pages/OrganizerProfilePage";
import EditEvent from "./components/EditEvent";
import FollowersPage from "./pages/FollowersPage";
import FollowingPage from "./pages/FollowingPage";
import LikedEventsPage from "./pages/LikedEventsPage";
import InboxPage from "./pages/InboxPage";
import EventAttendeesPage from "./pages/EventAttendeesPage";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/photo/:id" element={<PhotoDetailPage />} />
				<Route path="/login" element={<LoginSignup />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/add-event" element={<AddEvent />} />
					<Route path="/my-events" element={<MyEvents />} />
					<Route path="/logout" element={<LogoutPage />} />
					<Route path="/profile/" element={<Profile />} />
				</Route>
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/event/:id" element={<EventDetailPage />} />
				<Route path="/event/:id/edit" element={<EditEvent />} />
				<Route path="/organizer/:id" element={<OrganizerProfilePage />} />	
				<Route path="/user/:id/followers" element={<FollowersPage/>}/>
				<Route path="/user/:id/following" element={<FollowingPage/>}/>
				<Route path="/user/:userId/liked-events" element={<LikedEventsPage />} />
				<Route path="/inbox" element = {<InboxPage/>}/>
				<Route path="/event/:id/attendees" element={<EventAttendeesPage/>}/>
			</Routes>
		</Router>
	);
};

export default App;
