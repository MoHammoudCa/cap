import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/bootstrap.min.css";
import "./assets/css/login.css";
import "./assets/fontawesome/css/all.min.css";
import "./assets/css/templatemo-style.css";
import "./assets/js/plugins.js";
import "./assets/css/profile.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/addEvent.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./assets/css/FloatingButton.css";
import "./assets/css/search&Filter.css";
// import "./assets/js/login.js";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</StrictMode>
);
