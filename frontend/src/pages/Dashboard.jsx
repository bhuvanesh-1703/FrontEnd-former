import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";
import { AuthContext } from "../context/AuthContext";
import "../css/Dashboard.css";

import {
  FiMapPin,
  FiTruck,
  FiPackage,
  FiShoppingBag,
  FiLogOut,
  FiUser,
  FiGrid,
  FiSettings,
} from "react-icons/fi";

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["overview", "orders", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const currentUserId = userData?.id || userData?._id;

      if (!currentUserId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/orders?userId=${currentUserId}`,
      );
      setOrders(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [userData]);

  // Derived Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o?.order_status?.toLowerCase() === "pending",
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o?.order_status?.toLowerCase() === "delivered",
  ).length;

  const renderOverview = () => (
    <div className="fade-in">
      <div className="content-header">
        <h2 className="content-title">Dashboard Overview</h2>
        <p className="content-subtitle">
          Welcome back, {userData?.username || "Guest"}
        </p>
      </div>

      {/* <div className="overview-cards">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <FiPackage />
          </div>
          <div className="stat-info">
            <h3>{totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{pendingOrders}</h3>
            <p>Pending Delivery</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{deliveredOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>
      </div> */}

      {loading ? (
        <div className="text-center py-5">Loading recent activity...</div>
      ) : (
        <div style={{ marginTop: "40px" }}>
          <h3
            style={{ marginBottom: "20px", fontWeight: "600", color: "#333" }}
          >
            Recent Orders
          </h3>
          {renderOrders(3)}
        </div>
      )}
    </div>
  );

  const renderOrders = (limit = null) => {
    const displayOrders = limit ? orders.slice(0, limit) : orders;

    if (loading && !limit) {
      return <div className="text-center py-5">Loading your orders...</div>;
    }

    if (displayOrders.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <FiShoppingBag />
          </div>
          <h3>No Orders Found</h3>
          <p className="text-muted mb-4">
            Looks like you haven't made any purchases yet.
          </p>
          <Link to="/products" className="shop-now-btn">
            Explore Products
          </Link>
        </div>
      );
    }

    return (
      <div className="orders-list fade-in">
        {!limit && (
          <div className="content-header">
            <h2 className="content-title">My Orders</h2>
            <p className="content-subtitle">
              View and track all your recent purchases.
            </p>
          </div>
        )}

        {displayOrders.map((order, index) => (
          <div key={order?.id || index} className="order-card-new">
            <div className="order-top">
              <div>
                <span className="order-id-badge">Order #{order?.id}</span>
                <span
                  style={{
                    marginLeft: "15px",
                    color: "#777",
                    fontSize: "0.9rem",
                  }}
                >
                  {order?.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <span
                className={`order-status status-${
                  order?.order_status?.toLowerCase() || "pending"
                }`}
              >
                {order?.order_status || "Pending"}
              </span>
            </div>

            <div className="order-middle">
              <div className="order-items-scroll">
                {order?.products?.map((prod, pIdx) => (
                  <div key={pIdx} className="order-item-mini flex-shrink-0">
                    <img
                      src={
                        prod?.image
                          ? `${API_URL}/uploads/${prod.image.split(",")[0]}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={prod?.name}
                    />
                    <div className="order-item-details">
                      <strong>
                        {prod?.name?.length > 15
                          ? prod?.name.substring(0, 15) + "..."
                          : prod?.name}
                      </strong>
                      <span>
                        {prod?.quantity}kg • ₹{prod?.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total-price d-flex flex-column align-items-end justify-content-center border-start ps-3 ms-2">
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#777",
                    fontWeight: "normal",
                  }}
                >
                  Total Amount
                </span>
                ₹{order?.total_amount || 0}
              </div>
            </div>

            <div
              className="mt-3 pt-3 border-top"
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <FiMapPin className="text-secondary" />
                <span>
                  {order?.shipping_address?.address ||
                    order?.shipping_address?.city ||
                    "Address Info"}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FiTruck className="text-secondary" />
                <span>
                  {order?.payment_method === "Cash on Delivery"
                    ? "COD"
                    : order?.payment_method || "Payment"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="fade-in">
      <div className="content-header">
        <h2 className="content-title">Profile</h2>
      </div>

      <div className="profile-form">
        <div className="form-group-modern">
          <label>Full Name</label>
          <input
            type="text"
            className="form-input-modern"
            value={userData?.username || ""}
            disabled
          />
        </div>

        <div className="form-group-modern">
          <label>Email Address</label>
          <input
            type="email"
            className="form-input-modern"
            value={userData?.email || ""}
            disabled
          />
        </div>

        <div className="form-group-modern">
          <label>Phone Number</label>
          <input
            type="tel"
            className="form-input-modern"
            value={userData?.phonenumber || ""}
            disabled
          />
        </div>

        <div className="form-group-modern">
          <label>Account Role</label>
          <input
            type="text"
            className="form-input-modern"
            value={(userData?.role || "Customer").toUpperCase()}
            disabled
            style={{ fontWeight: "600", color: "#2D5A27" }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-user-info">
            {/* <div className="user-avatar">
              {userData?.username ? userData.username.charAt(0).toUpperCase() : "U"}
            </div> */}
            <h3 className="user-name">{userData?.username || "User"}</h3>
            <p className="user-email">{userData?.email || "No Email"}</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`sidebar-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <FiGrid /> Dashboard
            </button>
            <button
              className={`sidebar-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FiPackage /> My Orders
            </button>
            <button
              className={`sidebar-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FiUser /> Profile
            </button>
            <button
              className={`sidebar-btn ${activeTab === "notification" ? "active" : ""}`}
              onClick={() => setActiveTab("notification")}
            >
              <FiUser /> Notification
            </button>

            {userData?.role === "admin" && (
              <button
                className="sidebar-btn"
                onClick={() => navigate("/admin")}
                style={{ marginTop: "10px", background: "#f8f9fa" }}
              >
                <FiSettings /> Go to Admin Panel
              </button>
            )}

            <div className="sidebar-logout">
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut /> Disconnect
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "profile" && renderProfile()}
          {activeTab === "notification" && renderNotification()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
