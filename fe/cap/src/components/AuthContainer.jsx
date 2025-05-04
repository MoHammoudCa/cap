import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState({ email: "", password: "" }); // Store signed-up data
  const navigate = useNavigate();

  // Navigate to the appropriate URL based on isLogin state
  useEffect(() => {
    if (isLogin) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
  }, [isLogin, navigate]);

  return (
    <div className="container-fluid tm-container-content" style={{ paddingTop: "50px", paddingBottom: "100px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${!isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              {isLogin ? <LoginForm userData={userData} /> : <SignupForm setIsLogin={setIsLogin} setUserData={setUserData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;