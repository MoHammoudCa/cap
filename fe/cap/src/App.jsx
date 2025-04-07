import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhotoDetailPage from "./pages/EventDetailPage";
import LoginSignup from "./pages/LoginSignup";
import Profile from "./pages/Profile";
import AddEvent from "./pages/AddEvent";
import EventDetailPage from "./pages/EventDetailPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const userData = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	name: "John Doe",
	email: "john@example.com",
	role: "USER", // or 'ORGANIZER' or 'ADMIN'
	profile_picture: "https://example.com/path/to/image.jpg", // or null
	created_at: "2023-01-15T10:30:00.000Z",
};

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/photo/:id" element={<PhotoDetailPage />} />
				<Route path="/login" element={<LoginSignup />} />
				<Route path="/profile/:id" element={<Profile user={userData} />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/add-event" element={<AddEvent />} />
				</Route>
				<Route path="/event/:id" element={<EventDetailPage />} />
			</Routes>
		</Router>
	);
};

export default App;
