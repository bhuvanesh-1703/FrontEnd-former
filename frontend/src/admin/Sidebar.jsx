import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaLayerGroup,
  FaBox,
  FaShoppingCart,
  FaEnvelope,
  FaUsers,
  FaUser,
} from "react-icons/fa";
import "../Admin-Css-Folder/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <NavLink to="/admin" end className="sidebar-link">
            <FaThLarge className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/categories" className="sidebar-link">
            <FaLayerGroup className="sidebar-icon" />
            <span>Categories</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/products" className="sidebar-link">
            <FaBox className="sidebar-icon" />
            <span>Manage Products</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/orders" className="sidebar-link">
            <FaShoppingCart className="sidebar-icon" />
            <span>Manage Orders</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/messages" className="sidebar-link">
            <FaEnvelope className="sidebar-icon" />
            <span>Messages</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/vendors" className="sidebar-link">
            <FaUsers className="sidebar-icon" />
            <span>Manage Vendors</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/users" className="sidebar-link">
            <FaUsers className="sidebar-icon" />
            <span>Users</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/admin/profile" className="sidebar-link">
            <FaUser className="sidebar-icon" />
            <span>My Farm Profile</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
