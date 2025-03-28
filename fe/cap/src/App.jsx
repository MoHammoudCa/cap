// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhotoDetailPage from "./pages/PhotoDetailPage";
import LoginSignup from "./pages/LoginSignup";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/photo/:id" element={<PhotoDetailPage />} />
				<Route path="/login" element={<LoginSignup />} />
			</Routes>
		</Router>
	);
};

export default App;
