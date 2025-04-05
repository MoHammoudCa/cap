import React, { useState } from "react";
import "boxicons";

const SignupForm = ({ switchToLogin }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("Passwords do not match!");
			return;
		}
		console.log("Signup Data:", { email, password });
		// Add your signup logic here
	};

	return (
		<div className="form signup">
			<div className="form-content">
				<header>Signup</header>
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
