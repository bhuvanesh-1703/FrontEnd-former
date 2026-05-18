import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../config";
import {
  Container,
  Nav,
  Navbar,
  Form,
  FormControl,
  NavDropdown,
} from "react-bootstrap";
import { HiOutlineShoppingCart, HiSearch } from "react-icons/hi";
import { FaLeaf } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Navbar.css";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const { userData, setUserData } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  useEffect(() => {
    const fetchCartCount = async (userIdToUse) => {
      try {
        if (!userIdToUse) {
          setCartCount(0);
          return;
        }

        //console.log("Fetching cart for userId:", userIdToUse);
        const res = await axios.get(
          `${API_URL}/api/cart?userId=${userIdToUse}`,
        );

       // console.log("Cart API response:", res.data);

        // Handle different response structures
        let items = [];
        if (res.data.data) {
          items = Array.isArray(res.data.data) ? res.data.data : [];
        } else if (Array.isArray(res.data)) {
          items = res.data;
        }

        const count = items.length || 0;
        setCartCount(count);
        console.log("✓ Cart count set to:", count);
      } catch (error) {
        console.error("Error fetching cart count:", error.message);
        setCartCount(0);
      }
    };

    const getUserId = () => {
      if (userData?._id) {
        console.log("Got userId from context:", userData._id);
        return userData._id;
      }
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?._id || user?.id;
        if (id) console.log("Got userId from localStorage:", id);
        return id;
      } catch (e) {
        return null;
      }
    };

    const userId = getUserId();
    if (userId) {
      fetchCartCount(userId);
    } else {
      console.log("No userId found, setting cart count to 0");
      setCartCount(0);
    }

    const handleCartUpdate = () => {
      console.log("Cart update event received");
      const currentUserId = getUserId();
      if (currentUserId) {
        fetchCartCount(currentUserId);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    const interval = setInterval(() => {
      const currentUserId = getUserId();
      if (currentUserId) {
        fetchCartCount(currentUserId);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [userData]);

  return (
    <Navbar
      className="custom-navbar sticky-top"
      expand="lg"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="brand-container"
          aria-label="TerraFresh Home"
        >
          <div className="brand-logo-box">
            <FaLeaf className="leaf-icon" />
          </div>
          <span className="brand-name">
            <span className="terra">Farm</span>
            <span className="fresh">Aura</span>
          </span>
        </Navbar.Brand>

        {/* Custom Animated Hamburger */}
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler">
          <div className="hamburger-box">
            <span className="bar"></span>
            <span className="bar mid"></span>
            <span className="bar"></span>
          </div>
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto nav-links">
            <Nav.Link
              as={NavLink}
              to="/"
              end
              className="nav-item-link"
              onClick={() => setExpanded(false)}
            >
              Home
            </Nav.Link>

            <div
              className="nav-item-mega-wrapper"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Nav.Link
                as={NavLink}
                to="/products"
                className="nav-item-link"
                onClick={() => {
                  setExpanded(false);
                  setShowMegaMenu(false);
                }}
              >
                Products
              </Nav.Link>
            </div>

            <Nav.Link
              as={NavLink}
              to="/aboutus"
              className="nav-item-link"
              onClick={() => setExpanded(false)}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/contact"
              className="nav-item-link"
              onClick={() => setExpanded(false)}
            >
              Contact
            </Nav.Link>
          </Nav>

          <div className="navbar-right">
            <Form
              className="search-bar-container"
              onSubmit={handleSearch}
              role="search"
            >
              <HiSearch className="search-icon-inside" aria-hidden="true" />
              <FormControl
                type="search"
                placeholder="Search products..."
                className="search-input-field"
                aria-label="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>

            <Nav.Link
              as={NavLink}
              to="/cart"
              className="cart-action-link"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <HiOutlineShoppingCart
                className="cart-main-icon"
                aria-hidden="true"
              />
              {cartCount > 0 && (
                <span className="cart-notification-badge" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Nav.Link>

            <div className="auth-group-nav">
              {userData?.role !== "vendor" && (
                <Nav.Link
                  as={NavLink}
                  to="/vendor-register"
                  className="vendor-become-btn"
                  onClick={() => setExpanded(false)}
                >
                  Become a Vendor
                </Nav.Link>
              )}

              {userData ? (
                <div className="auth-group-nav">
                  {userData.role === "vendor" && (
                    <Nav.Link
                      as={NavLink}
                      to="/vendor-dashboard"
                      className="login-action-btn"
                      onClick={() => setExpanded(false)}
                      style={{
                        background: "#2D5A27",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Vendor Panel
                    </Nav.Link>
                  )}
                  <NavDropdown
                    title={
                      userData.username.charAt(0).toUpperCase() +
                      userData.username.slice(1)
                    }
                    id="basic-nav-dropdown"
                    className="login-action-btn-dropdown p-2 rounded-pill "
                    style={{
                      background: "transparent",
                      color: "white",
                      backgroundColor: "#0f350f",
                    }}
                  >
                    {userData.role === "admin" && (
                      <NavDropdown.Item
                        as={NavLink}
                        to="/admin"
                        onClick={() => setExpanded(false)}
                      >
                        Admin Panel
                      </NavDropdown.Item>
                    )}
                    {userData.role === "vendor" && (
                      <NavDropdown.Item
                        as={NavLink}
                        to="/vendor-dashboard"
                        onClick={() => setExpanded(false)}
                      >
                        Vendor Dashboard
                      </NavDropdown.Item>
                    )}
                    {userData.role === "customer" && (
                      <>
                        <NavDropdown.Item
                          as={NavLink}
                          to="/dashboard"
                          onClick={() => setExpanded(false)}
                        >
                          Dashboard
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={NavLink}
                          to="/dashboard?tab=orders"
                          onClick={() => setExpanded(false)}
                        >
                          My Orders
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          as={NavLink}
                          to="/dashboard?tab=profile"
                          onClick={() => setExpanded(false)}
                        >
                          Profile
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        setExpanded(false);
                        setUserData(null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        navigate("/login");
                      }}
                    >
                      Disconnect
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              ) : (
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  className="login-action-btn"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
