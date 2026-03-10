import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Css-Folder/Order.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5100/api/orders");
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.log("Fetching orders failed", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    Swal.fire({
      title: "Update Status?",
      text: `Change order status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2e7d32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5100/api/orders/${orderId}`, {
            order_status: newStatus,
          });
          Swal.fire("Updated!", "Order status has been updated.", "success");
          fetchOrders();
        } catch (err) {
          console.error("Failed to update status:", err);
          Swal.fire("Error", "Failed to update status.", "error");
        }
      }
    });
  };

  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5100/api/orders/${orderId}`);
          Swal.fire("Deleted!", "Order has been deleted.", "success");
          fetchOrders();
        } catch (err) {
          console.error("Failed to delete order:", err);
          Swal.fire("Error", "Failed to delete order.", "error");
        }
      }
    });
  };

  const handleViewDetails = (order) => {
    const productListHtml =
      order.products
        ?.map(
          (p) => `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; text-align: left; padding: 5px; border-bottom: 1px solid #eee;">
        <img src="http://localhost:5100/uploads/${p.image?.split(",")[0]}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />
        <div>
          <div style="font-weight: 600; font-size: 14px;">${p.name}</div>
          <div style="font-size: 12px; color: #666;">Qty: ${p.quantity}kg | Price: Rs.${p.price}</div>
        </div>
      </div>
    `,
        )
        .join("") || "<p>No products found</p>";

    Swal.fire({
      title: `<span style="color: #2e7d32">Order #${order.order_id}</span>`,
      html: `
        <div style="margin-top: 20px;">
          <h4 style="text-align: left; border-bottom: 2px solid #2e7d32; padding-bottom: 5px;">Customer </h4>
          <p style="text-align: left;"><strong>Name:</strong> ${order.customer_name || "N/A"}</p>
          <p style="text-align: left;"><strong>Email:</strong> ${order.customer_email || "N/A"}</p>
          <p style="text-align: left;"><strong>Address:</strong> ${order.shipping_address?.address}, ${order.shipping_address?.city}</p>
          
          <h4 style="text-align: left; border-bottom: 2px solid #2e7d32; padding-bottom: 5px; margin-top: 20px;">Products</h4>
          <div style="max-height: 250px; overflow-y: auto;">
            ${productListHtml}
          </div>
          
          <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: 700; color: #2e7d32;">
            Total: Rs.${order.total_amount}
          </div>
        </div>
      `,
      confirmButtonColor: "#2e7d32",
      width: "500px",
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Manage Orders</h2>
        <div className="orders-stats">
          <div className="stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>
      </div>

      <div className="orders-list-card">
        <div className="table-controls">
          <input type="search" placeholder="Search orders..." />
        </div>

        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Orders</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_name || `User ${order.user_id}`}</td>
                    <td>Rs.{order.total_amount || 0}</td>
                    <td>
                      <span
                        className={`status-badge ${(order.order_status || "pending").toLowerCase()}`}
                      >
                        {order.order_status || "Pending"}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleViewDetails(order)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                    <td>
                      {" "}
                      <select
                        className="status-select"
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        value={order.order_status}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td>
                      {" "}
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{
                          backgroundColor: "#d32f2f",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders found.
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

export default Orders;
