import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { GiFruiting } from "react-icons/gi";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const VendorSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2D5A27",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const navItems = [
    { path: "/vendor-dashboard", icon: <FiGrid />, label: "Dashboard" },
    { path: "/vendor-products", icon: <FiPackage />, label: "Products" },
    { path: "/vendor-add-product", icon: <FiPlus />, label: "Add Product" },
    { path: "/vendor-orders", icon: <FiShoppingBag />, label: "Orders" },
    { path: "/vendor-profile", icon: <FiUser />, label: "Profile" },
    { path: "#", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <aside className="vendor-sidebar">
      <div className="vendor-logo-area">
        <div className="vendor-logo-box">
          <GiFruiting size={24} />
        </div>
        <span className="vendor-brand-name">Vendor</span>
      </div>

      <nav className="vendor-nav-links">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `vendor-nav-item ${isActive ? "active" : ""}`
            }
          >
            <div className="vendor-nav-content">
              <span className="vendor-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.path !== "#" && <FiChevronRight size={14} />}
          </NavLink>
        ))}
      </nav>

      <div className="vendor-sidebar-footer">
        <button className="vendor-logout-btn" onClick={handleLogout}>
          <FiLogOut className="vendor-nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;
