import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Admin-Css-Folder/AdminLayout.css";

const AdminLayout = () => {
  const { userData } = useContext(AuthContext);

  if (!userData || userData.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
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
