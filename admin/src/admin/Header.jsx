import React from "react";
import "../Css-Folder/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Admin Panel</div>
      <div className="user-profile">
        <span>Welcome, Admin</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Header;
