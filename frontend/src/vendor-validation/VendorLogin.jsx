import React, { useState } from "react";
import API_URL from "../config";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Vendor.css";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!values.email) nextErrors.email = "Email is required";
    if (values.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/vendor/login`,
        values,
      );
      if (res.data?.success) {
        localStorage.setItem("vendorToken", res.data.data.token);
        const vendorDataWithRole = { ...res.data.data.vendorData, role: 'vendor' };
        localStorage.setItem("vendor", JSON.stringify(vendorDataWithRole));
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
      
        window.dispatchEvent(new Event("storage")); 
        
        Swal.fire({
          icon: "success",
          title: "Welcome Vendor!",
          text: "Login successful",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/vendor-dashboard");
        window.location.reload(); 
      } else {
        Swal.fire("Error", res.data?.message || "Login failed", "error");
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
        <h2>Vendor Login</h2>
        <p className="vendor-auth-subtitle">
          Manage your shop and products on Farm Aura.
        </p>

        <form onSubmit={onSubmit}>
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={values.password}
              onChange={onChange}
            />
            {errors.password && (
              <small className="vendor-error">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="vendor-auth-btn">
            Sign In to Dashboard
          </button>
        </form>

        <p className="vendor-auth-footer">
          Interested in selling?{" "}
          <Link to="/vendor-register">Create a vendor account</Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;
