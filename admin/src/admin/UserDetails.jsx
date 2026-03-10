import React from "react";
//import "../Css-Folder/UserDetails.css";

const UserDetails = () => {
  const user = {
    name: "Farmer Krishna",
    role: "Farm Manager",
    joinedDate: "January 15, 2024",
    location: "Village Section A - Organic Block",
    email: "krishna@farmproject.com",
    farmSize: "10 Acres",
    primaryCrop: "Organic Tomatoes",
  };

  
  
  return (
    <div className="user-details-container">
      <h2 className="user-details-title">My Farm Profile</h2>

      <div className="user-card shadow">
        <div className="user-header">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-info-basic">
            <h3>{user.name}</h3>
            <p className="user-role">{user.role}</p>
          </div>
        </div>

        <div className="user-info-grid">
          <div className="info-item">
            <label>Email Address</label>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <label>Joined Since</label>
            <p>{user.joinedDate}</p>
          </div>
          <div className="info-item">
            <label>Farm Location</label>
            <p>{user.location}</p>
          </div>
          <div className="info-item">
            <label>Farm Size</label>
            <p>{user.farmSize}</p>
          </div>
          <div className="info-item">
            <label>Primary Crop</label>
            <p>{user.primaryCrop}</p>
          </div>
        </div>

        <button className="edit-profile-btn">Edit Farm Profile</button>
      </div>
    </div>
  );
};

export default UserDetails;
