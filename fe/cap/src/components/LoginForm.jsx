import React, { useState } from "react";
import "boxicons";

const LoginForm = ({ switchToSignup }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Login Data:", { email, password });
		// Add your login logic here
	};

	return (
		<div className="form login">
			<div className="form-content">
				<header>Login</header>
				<form onSubmit={handleSubmit}>
					<div className="field input-field">
						<input
							type="email"
							placeholder="Email"
							className="input"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="field input-field">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							className="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<i
							className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye-icon`}
							onClick={() => setShowPassword(!showPassword)}
						></i>
					</div>
					<div className="form-link">
						<a href="#" className="forgot-pass">
							Forgot password?
						</a>
					</div>
					<div className="field button-field">
						<button type="submit">Login</button>
					</div>
				</form>
				<div className="form-link">
					<span>
						Don't have an account?{" "}
						<a href="#" className="link signup-link" onClick={switchToSignup}>
							Signup
						</a>
					</span>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
