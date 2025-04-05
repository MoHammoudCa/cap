import React, { useState, useContext } from "react";
import "boxicons";
import { AuthContext } from "../contexts/auth.context";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ switchToLogin }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const { register } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		const result = await register(name, email, password);
		if (result.success) {
			navigate("/login");
			switchToLogin();
		} else {
			setError(result.message || "Registration failed. Please try again.");
		}
	};

	return (
		<div className="form signup">
			<div className="form-content">
				<header>Signup</header>
				{error && <div className="error-message">{error}</div>}
				<form onSubmit={handleSubmit}>
					<div className="field input-field">
						<input
							type="text"
							placeholder="Full Name"
							className="input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
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
							placeholder="Create password"
							className="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="field input-field">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Confirm password"
							className="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<i
							className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye-icon`}
							onClick={() => setShowPassword(!showPassword)}
						></i>
						<box-icon name="rocket"></box-icon>
					</div>
					<div className="field button-field">
						<button type="submit">Signup</button>
					</div>
				</form>
				<div className="form-link">
					<span>
						Already have an account?{" "}
						<a href="#" className="link login-link" onClick={switchToLogin}>
							Login
						</a>
					</span>
				</div>
			</div>
		</div>
	);
};

export default SignupForm;
