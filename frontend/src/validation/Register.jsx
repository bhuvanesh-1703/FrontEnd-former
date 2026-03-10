import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/Login.css";

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  //regex

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z ]{3,30}$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validate = (nextValues) => {
    const nextErrors = {};
    const username = nextValues.username.trim();
    const email = nextValues.email.trim();
    const phonenumber = nextValues.phonenumber.trim();
    const password = nextValues.password;

    if (!nameRegex.test(username))
      nextErrors.username = "Name must be 3–30 letters";
    if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email";
    if (!phoneRegex.test(phonenumber) && values.phonenumber.length !== 10)
      nextErrors.phonenumber = "Enter a valid 10-digit Indian phone number";
    if (!passwordRegex.test(password))
      nextErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & symbol";

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
      const res = await axios.post(`http://localhost:5100/api/auth/register`, {
        username: values.username.trim(),
        email: values.email.trim(),
        phonenumber: values.phonenumber.trim(),
        password: values.password,
      });

      if (!res.data?.success) {
        Swal.fire("Registration failed", res.data?.message, "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Account created",
        text: "You can now sign in.",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/login");
    } catch (err) {
      Swal.fire("Server error", err.response?.data?.message, "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create account</h2>
        <p className="auth-subtitle">Get started with Farm Aura in minutes.</p>

        <form onSubmit={onSubmit} noValidate>
          <div className="auth-group">
            <label htmlFor="register-username">Full name</label>
            <input
              id="register-username"
              type="text"
              name="username"
              placeholder="Your name"
              value={values.username}
              onChange={onChange}
              autoComplete="name"
            />
            {errors.username && (
              <small className="error">{errors.username}</small>
            )}
          </div>

          <div className="auth-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter Your  Mail"
              value={values.email}
              onChange={onChange}
              autoComplete="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="auth-group">
            <label htmlFor="register-phone">Phone number</label>
            <input
              id="register-phone"
              type="tel"
              name="phonenumber"
              placeholder="10-digit mobile number"
              value={values.phonenumber}
              onChange={onChange}
              autoComplete="tel"
              maxLength="10"
            />
            {errors.phonenumber && (
              <small className="error">{errors.phonenumber}</small>
            )}
          </div>

          <div className="auth-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={values.password}
              onChange={onChange}
              autoComplete="new-password"
            />
            {errors.password && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Create account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
