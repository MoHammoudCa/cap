import React, { useContext } from 'react';
import { useAuth } from "../context/AuthContext";


const LogoutPage = () => {
  const { logout } = useAuth();

  const handleLogout = async() => {
    console.log("logged out");
    await logout();
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutPage;
