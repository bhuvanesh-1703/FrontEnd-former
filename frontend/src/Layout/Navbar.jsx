import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Nav, Navbar, Form, FormControl } from "react-bootstrap";
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

  const { userData } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setExpanded(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".search-input-field")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      const userId = userData?.id || userData?._id;
      if (userId) {
        try {
          const res = await axios.get(
            `http://localhost:5100/api/cart?userId=${userId}`,
          );
          setCartCount(res.data.data?.length || 0);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();

    const interval = setInterval(fetchCartCount, 5000);
    return () => clearInterval(interval);
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
              {!localStorage.getItem("vendor") && (
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
                  {localStorage.getItem("vendor") && (
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
                  <Nav.Link
                    as={NavLink}
                    to="/dashboard"
                    className="login-action-btn"
                    onClick={() => setExpanded(false)}
                  >
                    {userData.username.charAt(0).toUpperCase() +
                      userData.username.slice(1)}
                  </Nav.Link>
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
