import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = (nextValues) => {
    const nextErrors = {};
    const email = nextValues.email.trim();
    const password = nextValues.password;

    if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
    if (password.trim().length < 6)
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
    if (!validate(values)) return;

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: values.email.trim(),
        password: values.password.trim(),
      });

      if (!res.data?.success) {
        Swal.fire("Login failed", res.data?.message || "Try again", "error");
        return;
      }

      const token = res.data?.data?.token;
      const user = res.data?.data?.user;

      if (token) localStorage.setItem("token", token);
      if (user) {
        const role = user.role?.toLowerCase() || 'customer';
        const userDataWithRole = { ...user, role };
        localStorage.setItem("user", JSON.stringify(userDataWithRole));
        localStorage.removeItem("vendor");
        localStorage.removeItem("vendorToken");
        setUserData?.(userDataWithRole);

        Swal.fire({
          icon: "success",
          title: "Welcome back",
          text: "Signed in successfully.",
          timer: 1200,
          showConfirmButton: false,
        });

        if (role === 'admin' || role === 'customer') {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      Swal.fire("Login Failed", err.response?.data?.message || "An error occurred during login", "warning");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to continue shopping.</p>

        <form onSubmit={onSubmit} noValidate>
          <div className="auth-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter Your Mail"
              value={values.email}
              onChange={onChange}
              autoComplete="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="auth-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Your password"
              value={values.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Sign in
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
