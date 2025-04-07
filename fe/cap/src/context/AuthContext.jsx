import { createContext, useContext, useState, useEffect } from "react";
import {
	login as loginApi,
	register as registerApi,
	getCurrentUser,
} from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const currentUser = getCurrentUser();
		setUser(currentUser);
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		const response = await loginApi(email, password);
		console.log(response);

		localStorage.setItem("token", response.token);
		localStorage.setItem(
			"user",
			JSON.stringify({
				id: response.id,
				email: response.email,
				role: response.role,
			})
		);
		setUser({ email: response.email, role: response.role });
		return response;
	};

	const register = async (userData) => {
		const response = await registerApi(userData);

		localStorage.setItem("token", response.token);
		localStorage.setItem(
			"user",
			JSON.stringify({
				id: response.id,
				email: response.email,
				role: response.role,
			})
		);
		setUser({ email: response.email, role: response.role });
		return response;
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
