import React from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/vendor/VendorSidebar";
import VendorHeader from "../components/vendor/VendorHeader";
import "../css/vendor/vendor-layout.css";

const VendorLayout = () => {
  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  return (
    <div className="vendor-layout-container">
      <VendorSidebar />
      <div className="vendor-main-content">
        <VendorHeader vendorData={vendorData} />
        <div className="vendor-page-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
