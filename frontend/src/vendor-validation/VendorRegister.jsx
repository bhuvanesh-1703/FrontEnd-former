import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Vendor.css";

import API_URL from "../config";

const VendorRegister = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    phonenumber: "",
    shopName: "",
    password: "",
  });
  const [idProof, setIdProof] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!values.username.trim()) nextErrors.username = "Name is required";
    if (!values.email.includes("@"))
      nextErrors.email = "Valid email is required";
    if (values.phonenumber.length !== 10)
      nextErrors.phonenumber = "10-digit phone number is required";
    if (!values.shopName.trim()) nextErrors.shopName = "Shop name is required";
    if (values.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters";
    if (!idProof) nextErrors.idProof = "ID Proof is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onFileChange = (e) => {
    setIdProof(e.target.files[0]);
    setErrors((prev) => ({ ...prev, idProof: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("phonenumber", values.phonenumber);
    formData.append("shopName", values.shopName);
    formData.append("password", values.password);
    formData.append("idProof", idProof);

    try {
      const res = await axios.post(
        `${API_URL}/api/vendor/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Submitted!",
          text: res.data.message || "Your application is pending approval.",
          timer: 3000,
          showConfirmButton: false,
        });
        navigate("/vendor-login");
      } else {
        Swal.fire("Error", res.data?.message || "Registration failed", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Server error",
        "error",
      );
    }
  };

  return (
    <div className="vendor-auth-container">
      <div className="vendor-auth-card">
        <h2>Become a Vendor</h2>
        <p className="vendor-auth-subtitle">
          Join Farm Aura and reach thousands of customers.
        </p>

        <form onSubmit={onSubmit}>
          <div className="vendor-auth-group">
            <label>Full Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Your Name"
              value={values.username}
              onChange={onChange}
            />
            {errors.username && (
              <small className="vendor-error">{errors.username}</small>
            )}
          </div>

          <div className="vendor-auth-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={values.email}
              onChange={onChange}
            />
            {errors.email && (
              <small className="vendor-error">{errors.email}</small>
            )}
          </div>

          <div className="vendor-auth-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phonenumber"
              placeholder="Enter Your Phone Number"
              value={values.phonenumber}
              onChange={onChange}
              maxLength="10"
            />
            {errors.phonenumber && (
              <small className="vendor-error">{errors.phonenumber}</small>
            )}
          </div>

          <div className="vendor-auth-group">
            <label>Shop Name</label>
            <input
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={values.shopName}
              onChange={onChange}
            />
            {errors.shopName && (
              <small className="vendor-error">{errors.shopName}</small>
            )}
          </div>

          <div className="vendor-auth-group">
            <label>ID Proof (Aadhar/PAN)</label>
            <input
              type="file"
              name="idProof"
              accept="image/*"
              onChange={onFileChange}
              className="vendor-file-input"
            />
            {errors.idProof && (
              <small className="vendor-error">{errors.idProof}</small>
            )}
          </div>

          <div className="vendor-auth-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={values.password}
              onChange={onChange}
            />
            {errors.password && (
              <small className="vendor-error">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="vendor-auth-btn">
            Create Vendor Account
          </button>
        </form>

        <p className="vendor-auth-footer">
          Already selling with us? <Link to="/vendor-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default VendorRegister;
