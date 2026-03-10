import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "../Css-Folder/AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Header />
      <div className="admin-body">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
