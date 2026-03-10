import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "../../css/vendor/vendor-dashboard.css";

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    orders: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const ProductResponse = await axios.get(
          `http://localhost:5100/api/product?vendorId=${vendorData.id}`,
        );
        const fetchedProducts = ProductResponse.data.product;
        setProducts(fetchedProducts.slice(0, 5)); // Just top 5

        // Fetch orders
        const OrderResponse = await axios.get(
          `http://localhost:5100/api/orders?vendorId=${vendorData.id}`,
        );
        const fetchedOrders = OrderResponse.data.data || [];
        setOrders(fetchedOrders.slice(0, 5));

        setStats({
          total: fetchedProducts.length,
          pending: fetchedProducts.filter((p) => p.status === "pending").length,
          approved: fetchedProducts.filter((p) => p.status === "approved")
            .length,
          orders: fetchedOrders.length,
        });
      } catch (err) {
        console.error("Error fetching vendor dashboard data:", err);
      }
    };
    if (vendorData) fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Product",
      value: stats.total,
      icon: <FiPackage />,
      color: "#2D5A27",
      bgColor: "#E8F5E9",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: <FiShoppingBag />,
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      label: "Pending Approval",
      value: stats.pending,
      icon: <FiClock />,
      color: "#F57C00",
      bgColor: "#FFF3E0",
    },
    {
      label: "Active Orders",
      value: stats.orders, // For demo, using total orders
      icon: <FiActivity />,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
    },
  ];

  return (
    <div className="vendor-dashboard-content">
      <h1 className="vendor-welcome-text">Welcome, {vendorData?.username}!</h1>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div
              className="stat-icon-wrapper"
              style={{ background: stat.bgColor, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections-row">
        {/* Product Inventory Table */}
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3 className="section-title">Product Inventory</h3>
            <Link to="/vendor-products" className="view-all-btn">
              All
            </Link>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: "600" }}>{p.name}</td>
                    <td>₹{parseFloat(p.price || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-${p.status}-pill`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Orders Table */}
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3 className="section-title">Recent Orders</h3>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.order_id}</td>
                    <td>{o.customer_name}</td>
                    <td>₹{o.total_amount.toLocaleString()}</td>
                    <td>
                      <span className="status-approved-pill">
                        {o.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      <FiShoppingBag
                        size={48}
                        style={{ marginBottom: "15px", opacity: 0.2 }}
                      />
                      <p>No recent orders.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
