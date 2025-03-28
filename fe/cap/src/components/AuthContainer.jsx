import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "../assets/css/login.css";

const AuthContainer = () => {
	const [isLogin, setIsLogin] = useState(true);

	const switchToSignup = () => {
		setIsLogin(false);
	};

	const switchToLogin = () => {
		setIsLogin(true);
	};

	return (
		<section className={`container forms ${isLogin ? "" : "show-signup"}`}>
			{isLogin ? (
				<LoginForm switchToSignup={switchToSignup} />
			) : (
				<SignupForm switchToLogin={switchToLogin} />
			)}
		</section>
	);
};

export default AuthContainer;
