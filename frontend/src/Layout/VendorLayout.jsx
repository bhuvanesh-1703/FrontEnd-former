import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import VendorSidebar from "../components/vendor/VendorSidebar";
import VendorHeader from "../components/vendor/VendorHeader";
import { AuthContext } from "../context/AuthContext";
import "../css/vendor/vendor-layout.css";

const VendorLayout = () => {
  const { userData } = useContext(AuthContext);

  if (!userData || userData.role !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="vendor-layout-container">
      <VendorSidebar />
      <div className="vendor-main-content">
        <VendorHeader vendorData={userData} />
        <div className="vendor-page-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
