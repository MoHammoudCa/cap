import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth"; // Assuming this is the register API
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

const SignupForm = ({ setIsLogin, setUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password requirements
  const passwordRequirements = [
    { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
    { id: 2, text: "At least 1 uppercase letter", regex: /[A-Z]/ },
    { id: 3, text: "At least 1 lowercase letter", regex: /[a-z]/ },
    { id: 4, text: "At least 1 number", regex: /[0-9]/ },
    { id: 5, text: "At least 1 special character", regex: /[^A-Za-z0-9]/ },
  ];

  const checkPasswordRequirements = (password) => {
    return passwordRequirements.map((req) => ({
      ...req,
      isValid: req.regex.test(password),
    }));
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    const passwordChecks = checkPasswordRequirements(formData.password);
    const passwordValid = passwordChecks.every((req) => req.isValid);

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordValid) {
      newErrors.password = "Password doesn't meet requirements";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: "USER",
      };
      await register(userData);

      // Store user data to prefill login
      setUserData({
        email: formData.email,
        password: formData.password,
      });

      // Once registration is successful, switch to login view
      setIsLogin(true);  // Switch to login form

      // Optionally navigate to login page
      navigate("/login");
    } catch (err) {
      setErrors({ form: err.message || "Email already in use. Try signing in." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChecks = checkPasswordRequirements(formData.password);

  return (
    <form onSubmit={handleSubmit}>
      {errors.form && (
        <div className="alert alert-danger mb-4" role="alert">
          {errors.form}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}

        <div className="mt-2">
          <small className="text-muted">Password must contain:</small>
          <ul className="list-unstyled small">
            {passwordChecks.map((req) => (
              <li key={req.id} className={req.isValid ? "text-success" : "text-muted"}>
                {req.isValid ? <FaCheck className="me-1" /> : <FaTimes className="me-1" />}
                {req.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 mb-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ) : null}
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;