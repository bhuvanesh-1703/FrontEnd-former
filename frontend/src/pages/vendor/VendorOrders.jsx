import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../config";
import { FiSearch, FiEye, FiPackage } from "react-icons/fi";
import Swal from "sweetalert2";
import "../../css/VendorOrders.css";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/orders?vendorId=${vendorData.id}`,
      );
      setOrders(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorData) fetchOrders();
  }, []);

  const pendingCount = orders.filter(
    (o) => o.order_status === "Pending" || o.order_status === "Placed",
  ).length;
  const completedCount = orders.filter(
    (o) => o.order_status === "Delivered" || o.order_status === "Completed",
  ).length;

  const filteredOrders = orders.filter((order) => {
    return (
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "placed":
        return { bg: "#fff3e0", color: "#e65100" };
      case "shipped":
        return { bg: "#e3f2fd", color: "#1565c0" };
      case "delivered":
      case "completed":
        return { bg: "#e8f5e9", color: "#2e7d32" };
      case "cancelled":
        return { bg: "#ffebee", color: "#c62828" };
      default:
        return { bg: "#f5f5f5", color: "#616161" };
    }
  };

  const ViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await axios.put(`${API_URL}/api/orders/${orderId}`, {
        order_status: newStatus,
      });

      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, order_status: newStatus } : order,
      );
      setOrders(updatedOrders);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, order_status: newStatus }));
      }

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order status has been changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "center",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update the order status. Please try again.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="vendor-orders-page">
      <div className="section-header">
        <h2>Orders Management</h2>
        <p>Track and manage your customer orders.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card pending">
          <p>Pending Orders</p>
          <h3>{pendingCount}</h3>
        </div>
        <div className="stat-card completed">
          <p>Completed</p>
          <h3>{completedCount}</h3>
        </div>
      </div>

      <div className="orders-table-container">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Vendor Subtotal</th>
                  <th>Status</th>
                  <th className="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.order_status);
                  return (
                    <tr key={order.id}>
                      <td className="order-id">
                        {order.order_id?.substring(0, 8)}...
                      </td>
                      <td>
                        <div className="customer-name">
                          {order.customer_name}
                        </div>
                        <div className="customer-email">
                          {order.customer_email}
                        </div>
                      </td>
                      <td className="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="order-total">
                        ₹{order.total_amount?.toLocaleString() || "0.00"}
                      </td>
                      <td>
                        <select
                          value={order.order_status || "Pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order.id, e.target.value)
                          }
                          disabled={updatingStatus}
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            border: "1px solid #e5e7eb",
                            outline: "none",
                            cursor: updatingStatus ? "not-allowed" : "pointer",
                            textTransform: "uppercase",
                            opacity: updatingStatus ? 0.7 : 1,
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="center">
                        <button
                          className="details-btn"
                          onClick={() => ViewDetails(order)}
                        >
                          <FiEye size={14} /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FiPackage size={48} className="empty-icon" />
            <p className="empty-text">No recent orders.</p>
            {searchTerm && (
              <p className="empty-subtext">
                Try adjusting your search criteria.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div
          className="vendor-order-modal-overlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="vendor-order-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="vendor-order-modal-header">
              <div>
                <h3>Order Details</h3>
                <p>ID: {selectedOrder.order_id}</p>
              </div>
              <button
                className="vendor-order-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="vendor-order-modal-body">
              {/* Customer Info & Status */}
              <div className="vendor-order-modal-grid">
                <div>
                  <h4 className="vendor-order-modal-section-title">Customer</h4>
                  <p className="vendor-order-modal-text-bold">
                    {selectedOrder.customer_name}
                  </p>
                  <p className="vendor-order-modal-text">
                    {selectedOrder.customer_email}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    {selectedOrder.customer_phone || "No phone provided"}
                  </p>
                </div>
                <div>
                  <h4 className="vendor-order-modal-section-title">
                    Order Info
                  </h4>
                  <p className="vendor-order-modal-text">
                    <span className="vendor-order-modal-text-light">Date:</span>{" "}
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                  <p className="vendor-order-modal-text">
                    <span className="vendor-order-modal-text-light">
                      Payment:
                    </span>{" "}
                    {selectedOrder.payment_method || "Online"}
                  </p>
                  <div style={{ marginTop: "8px" }}>
                    <span
                      className="status-badge"
                      style={{
                        background: getStatusStyle(selectedOrder.order_status)
                          .bg,
                        color: getStatusStyle(selectedOrder.order_status).color,
                      }}
                    >
                      {selectedOrder.order_status || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="vendor-order-modal-shipping">
                <h4 className="vendor-order-modal-section-title">
                  Shipping Address
                </h4>
                <div className="vendor-order-modal-shipping-text">
                  {(() => {
                    if (!selectedOrder.shipping_address)
                      return "Address not provided";

                    try {
                      const addressObj =
                        typeof selectedOrder.shipping_address === "string"
                          ? JSON.parse(selectedOrder.shipping_address)
                          : selectedOrder.shipping_address;

                      if (
                        typeof addressObj === "object" &&
                        addressObj !== null
                      ) {
                        return (
                          <>
                            <p className="vendor-order-modal-text-bold">
                              {addressObj.fullName}
                            </p>
                            <p className="vendor-order-modal-text">
                              {addressObj.address}
                            </p>
                            <p className="vendor-order-modal-text">
                              {addressObj.city} - {addressObj.pincode}
                            </p>
                            <p style={{ margin: 0 }}>
                              Phone: {addressObj.phone}
                            </p>
                          </>
                        );
                      }
                    } catch (e) {
                      // If it's not valid JSON, just return the string as is
                    }

                    return (
                      <p style={{ margin: 0 }}>
                        {String(selectedOrder.shipping_address)}
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="vendor-order-modal-section-title">
                  Order Items
                </h4>
                <div className="vendor-order-modal-items">
                  {(() => {
                    let items = [];
                    try {
                      items =
                        typeof selectedOrder.products === "string"
                          ? JSON.parse(selectedOrder.products)
                          : selectedOrder.products || [];
                    } catch (e) {
                      console.error("Failed to parse items", e);
                    }

                    if (items.length === 0) {
                      return (
                        <div
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          No items found
                        </div>
                      );
                    }

                    return items.map((item, idx) => (
                      <div key={idx} className="vendor-order-modal-item">
                        <div>
                          <p className="vendor-order-modal-item-name">
                            {item.name ||
                              item.product_name ||
                              "Unknown Product"}
                          </p>
                          <p className="vendor-order-modal-item-details">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <div className="vendor-order-modal-item-price">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Total */}
                <div className="vendor-order-modal-total">
                  <span className="vendor-order-modal-total-label">
                    Vendor Subtotal
                  </span>
                  <span className="vendor-order-modal-total-value">
                    ₹{selectedOrder.total_amount?.toLocaleString() || "0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="vendor-order-modal-footer">
              <button
                onClick={() => setIsModalOpen(false)}
                className="vendor-order-modal-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
