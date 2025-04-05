// src/contexts/auth.context.js
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const AuthContext = createContext();

function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const user = AuthService.getCurrentUser();
		if (user) {
			setCurrentUser(user);
			setIsAuthenticated(true);
		}
		setIsLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			const user = await AuthService.login(email, password);
			setCurrentUser(user);
			setIsAuthenticated(true);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || "Login failed",
			};
		}
	};

	const register = async (name, email, password) => {
		try {
			await AuthService.register(name, email, password);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || "Registration failed",
			};
		}
	};

	const logout = () => {
		AuthService.logout();
		setCurrentUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				isAuthenticated,
				isLoading,
				login,
				register,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider };
