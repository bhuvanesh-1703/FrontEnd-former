import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import ViewProduct from "./pages/ViewProduct";
import Home from "./pages/Home";
import Product from "./pages/Product";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import CategoryView from "./pages/CategoryView";
import Login from "./validation/Login";
import Register from "./validation/Register";
import VendorLogin from "./vendor-validation/VendorLogin";
import VendorRegister from "./vendor-validation/VendorRegister";
import ShippingInfo from "./pages/ShippingInfo";
import Category from "./pages/Category";
import Sustainability from "./pages/Sustainability";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import VendorLayout from "./Layout/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProductVendor from "./pages/vendor/AddProductVendor";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProfile from "./pages/vendor/VendorProfile";

import { HiArrowUp } from "react-icons/hi";
import "./App.css";

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isVendorRoute = location.pathname.startsWith("/vendor-");

  return (
    <div className="App">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/viewcategory" element={<CategoryView />} />
          <Route path="/viewcategory/:id" element={<CategoryView />} />
          <Route path="/category" element={<Category />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/shippinginfo" element={<ShippingInfo />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/productdetails/:id" element={<ViewProduct />} />
          <Route path="/productdetails" element={<ViewProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Vendor Routes */}
          <Route path="/" element={<VendorLayout />}>
            <Route path="vendor-dashboard" element={<VendorDashboard />} />
            <Route path="vendor-products" element={<VendorProducts />} />
            <Route path="vendor-add-product" element={<AddProductVendor />} />
            <Route path="vendor-orders" element={<VendorOrders />} />
            <Route path="vendor-profile" element={<VendorProfile />} />
          </Route>
        </Routes>
      </main>

      {!isVendorRoute && <Footer />}

      <button
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <HiArrowUp />
      </button>
    </div>
  );
}

export default App;
