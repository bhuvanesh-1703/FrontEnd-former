
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
        `http://localhost:5100/api/orders?userId=${currentUserId}`
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

          {userData?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "dash-link active" : "dash-link"
              }
            >
              <FiMessageSquare /> Admin Panel
            </NavLink>
          )}

        </div>

        <div className="dashboard-title-area">
          <h1>My Dashboard</h1>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px" }}>
          Loading...
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-list">

          {orders.map((order, index) => (
            <div key={order?.id || index} className="order-card">

              <div className="order-header">
                <span className="order-date">
                  Ordered on{" "}
                  {order?.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </span>

                <span className="order-id">
                  ID: #{order?.id}
                </span>
              </div>

              <div className="order-details">

                <div className="order-info">

                  <div className="product-info-block">

                    <h3 className="order-title">
                      Products <FiPackage size={16} />
                    </h3>

                    <div className="order-products-mini">

                      {order?.products?.map((prod, pIdx) => (
                        <div key={pIdx} className="mini-product-item">

                          <img
                            src={
                              prod?.image
                                ? `http://localhost:5100/uploads/${prod.image.split(",")[0]}`
                                : "https://via.placeholder.com/50"
                            }
                            alt={prod?.name}
                            className="mini-prod-img"
                          />

                          <div className="mini-prod-details">
                            <span>{prod?.name}</span>
                            <span>
                              {prod?.quantity}kg • ₹{prod?.price}
                            </span>
                          </div>

                        </div>
                      ))}

                    </div>

                  </div>

                  <p className="order-text">
                    <FiMapPin size={14} />
                    {order?.shipping_address?.address ||
                      order?.shipping_address?.city ||
                      "Address not available"}
                  </p>

                  <p className="order-text">
                    <FiTruck size={14} />
                    {order?.payment_method || "Payment Method"}
                  </p>

                  <div className="order-text">
                    Status: {order?.order_status || "Pending"}
                  </div>

                </div>

                <div className="order-price">
                  ₹{order?.total_amount || 0}
                </div>

              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="no-orders text-center">

          <h2>No orders found</h2>

          <button
            onClick={() => navigate("/products")}
            className="btn btn-success"
          >
            <FiShoppingBag /> Go Shopping
          </button>

        </div>
      )}
    </div>
  );
};

export default Dashboard;

