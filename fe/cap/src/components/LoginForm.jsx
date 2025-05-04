import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({userData}) => {
const [email, setEmail] = useState(userData.email || "");
  const [password, setPassword] = useState(userData.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
		</div>        
      
      <button 
        type="submit" 
        className="btn btn-primary w-100 mb-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ) : null}
        Login
      </button>
    </form>
  );
};

export default LoginForm;