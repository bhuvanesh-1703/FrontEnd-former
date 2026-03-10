import React from "react";
import { FiSearch, FiUser } from "react-icons/fi";

const VendorHeader = ({ vendorData }) => {
  return (
    <header className="vendor-header">
      <div className="vendor-search-bar">
        <FiSearch className="vendor-search-icon" />
        <input type="text" placeholder="Search items, orders..." />
      </div>

      <div className="vendor-top-profile">
        <div className="vendor-profile-info">
          <span className="vendor-p-name">
            {vendorData?.username || "Vendor"}
          </span>
          <span className="vendor-p-role">Premium Vendor</span>
        </div>
        <div className="vendor-avatar">
          <FiUser size={20} />
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
