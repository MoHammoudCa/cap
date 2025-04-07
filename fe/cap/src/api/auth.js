import api from "./axios";

export const login = async (email, password) => {
	try {
		const response = await api.post("/auth/signin", { email, password });
		return response.data;
	} catch (error) {
		console.log(error);

		throw error.response?.data || error.message;
	}
};

export const register = async (userData) => {
	try {
		const response = await api.post("/auth/signup", userData);
		return response.data;
	} catch (error) {
		throw error.response?.data || error.message;
	}
};

export const getCurrentUser = () => {
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};
