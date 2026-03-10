import React, { useEffect, useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../css/Dashboard.css";
import {
  FiMapPin,
  FiTruck,
  FiPackage,
  FiShoppingBag,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";

const Dashboard = () => {
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
      const currentUserId = userData?.id;
      if (!currentUserId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5100/api/orders?userId=${currentUserId}`,
      );
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [userData]);

  return (
    <div className="orders-section">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "dash-link active" : "dash-link"
            }
          >
            <FiPackage /> Orders
          </NavLink>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive ? "dash-link active" : "dash-link"
            }
          >
            <FiMessageSquare /> Messages
          </NavLink>
        </div>
        <div className="dashboard-title-area">
          <h1>My Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="loading-state"
          style={{ textAlign: "center", padding: "100px" }}
        >
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order.id || index} className="order-card">
              <div className="order-header">
                <span className="order-date">
                  Ordered on{" "}
                  {new Date(order.created_at).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
                <span
                  className="order-id"
                  style={{ fontSize: "0.8rem", color: "#7f8c8d" }}
                >
                  ID: #
                  {order.id?.toString().slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="order-details">
                <div className="order-info">
                  <div className="product-info-block">
                    <h3 className="order-title">
                      <span>Products</span>
                      <FiPackage size={16} />
                    </h3>
                    <div className="order-products-mini">
                      {(order.products)?.map((prod, pIdx) => (
                        <div key={pIdx} className="mini-product-item">
                          <img
                            src={
                              prod.image
                                ? `http://localhost:5100/uploads/${prod.image.split(",")[0]}`
                                : "https://via.placeholder.com/50"
                            }
                            alt={prod.name}
                            className="mini-prod-img"
                          />
                          <div className="mini-prod-details">
                            <span className="mini-prod-name">{prod.name}</span>
                            <span className="mini-prod-qty">
                              {prod.quantity}kg • ₹{prod.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="order-text">
                    <FiMapPin size={14} />
                    {order.shipping_address?.address ||
                      order.shipping_address?.city ||
                      "Address Details"}
                  </p>

                  <p className="order-text">
                    <FiTruck size={14} />
                    {order.payment_method || order.paymentMethod}
                  </p>

                  <div className="order-text">
                    Status: <span>{order.order_status || order.status}</span>
                  </div>
                </div>

                <div className="order-price">
                  ₹{(order.total_amount || order.totalPrice)?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders text-center">
          <h2>No orders found yet</h2>
          <p style={{ color: "#7f8c8d", marginBottom: "25px" }}>
            Looks like you haven't placed any orders yet. Start exploring our
            organic farm fresh products!
          </p>
          <button
            className="btn btn-success px-4 py-2"
            style={{
              backgroundColor: "#2D5A27",
              border: "none",
              borderRadius: "8px",
            }}
            onClick={() => navigate("/products")}
          >
            <FiShoppingBag className="me-2" /> Go Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
