import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import API_URL from "../../config";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiEdit2,
  FiSave,
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const VendorProfile = () => {
  const { setUserData } = useContext(AuthContext);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    shopName: "",
  });

  const vendorLocal = JSON.parse(localStorage.getItem("vendor"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vendor/${vendorLocal.id}`);
        setVendor(res.data.data);
        setFormData({
          username: res.data.data.username,
          phonenumber: res.data.data.phonenumber,
          shopName: res.data.data.shop_name,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
        setLoading(false);
      }
    };
    if (vendorLocal) fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/vendor/profile/${vendorLocal.id}`,
        formData,
      );
      if (res.data.success) {
        setVendor(res.data.data);
        localStorage.setItem("vendor", JSON.stringify(res.data.data));
        Swal.fire("Success", "Profile updated successfully", "success");
        setIsEditing(false);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div
      className="order-card"
      style={{
        padding: "40px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "var(--vendor-shadow)",
      }}
    >
      <div
        className="section-header"
        style={{
          marginBottom: "30px",
          borderBottom: "1px solid var(--vendor-border)",
          paddingBottom: "20px",
        }}
      >
        <h3 className="section-title">My Shop Profile</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="view-all-btn"
          style={{
            background: isEditing ? "#7F8C8D" : "var(--vendor-primary)",
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <FiEdit2 /> Edit Profile
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Shop Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FiHome />
              </span>
              <input
                type="text"
                name="shopName"
                className="form-control"
                value={formData.shopName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Vendor Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FiUser />
              </span>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FiMail />
              </span>
              <input
                type="email"
                className="form-control"
                value={vendor?.email}
                disabled
              />
            </div>
            <small className="text-muted">Email cannot be changed.</small>
          </div>
          <div className="col-md-6 mb-4">
            <label
              style={{
                fontWeight: "600",
                color: "#2D5A27",
                marginBottom: "8px",
              }}
            >
              Phone Number
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FiPhone />
              </span>
              <input
                type="text"
                name="phonenumber"
                className="form-control"
                value={formData.phonenumber}
                onChange={handleChange}
                disabled={!isEditing}
                required
                maxLength="10"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              type="submit"
              className="view-all-btn"
              style={{
                padding: "12px 40px",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginLeft: "auto",
                border: "none",
              }}
            >
              <FiSave /> Save Changes
            </button>
          </div>
        )}
      </form>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "30px",
          borderTop: "1px solid #eee",
        }}
      >
        <h5 style={{ color: "#7F8C8D", marginBottom: "15px" }}>
          Account Status
        </h5>
        <div
          className={`status-badge ${vendor?.status === "approved" ? "status-delivered" : "status-pending"}`}
          style={{ display: "inline-block" }}
        >
          {vendor?.status?.toUpperCase()}
        </div>
        <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
          Joined on {new Date(vendor?.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default VendorProfile;
