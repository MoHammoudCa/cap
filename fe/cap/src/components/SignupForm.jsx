import React, { useState } from "react";
import "boxicons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ switchToLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (password !== confirmPassword) {
				alert("Passwords do not match!");
				return;
			}
			const userData = {
				email,
				password,
				name,
				role: "USER",
			};
			await register(userData);
			navigate("/");
		} catch (err) {
			setError(err.message || "signup failed");
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
							placeholder="Name"
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
							className={`fa-solid ${
								showPassword ? "fa-eye-slash" : "fa-eye"
							} eye-icon`}
							onClick={() => setShowPassword(!showPassword)}
						></i>
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
