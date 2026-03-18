import React, { useContext } from "react";
import "../Admin-Css-Folder/Header.css";
import { AuthContext } from "../context/AuthContext";


const Header = () => {
  const { logout } = useContext(AuthContext);
  return (
    <header className="header">
      <div className="logo">Admin Panel</div>
      <div className="user-profile">
        <span>Welcome, Admin</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
