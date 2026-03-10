import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiEye, FiPackage } from "react-icons/fi";
import Swal from "sweetalert2";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const vendorData = JSON.parse(localStorage.getItem("vendor"));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5100/api/orders?vendorId=${vendorData.id}`,
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

  const ViewDetails=()=>{
  
    Swal.fire({
      title: "Order Details",
      text: "Order details will be displayed here",
      icon: "info",
      confirmButtonText: "OK",
    });


  }  
  

  return (
    <div className="vendor-orders-page" style={{ padding: "0" }}>
      <div className="section-header" style={{ marginBottom: "30px" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "5px",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Orders Management
        </h2>
        <p style={{ color: "#6b7280", margin: 0, fontWeight: "500" }}>
          Track and manage your customer orders.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            borderLeft: "4px solid #f97316",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 10px 0",
            }}
          >
            Pending Orders
          </p>
          <h3
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#111827",
              margin: 0,
            }}
          >
            {pendingCount}
          </h3>
        </div>
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            borderLeft: "4px solid #22c55e",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 10px 0",
            }}
          >
            Completed
          </p>
          <h3
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#111827",
              margin: 0,
            }}
          >
            {completedCount}
          </h3>
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ position: "relative", width: "100%", maxWidth: "300px" }}
          >
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 12px 10px 36px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                width: "100%",
                outline: "none",
                fontSize: "0.95rem",
                background: "#f9fafb",
              }}
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Vendor Subtotal
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.order_status);
                  return (
                    <tr
                      key={order.id}
                      style={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <td
                        style={{
                          padding: "16px",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {order.order_id?.substring(0, 8)}...
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {order.customer_name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          {order.customer_email}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                        }}
                      >
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          fontSize: "0.95rem",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        ₹{order.total_amount?.toLocaleString() || "0.00"}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            display: "inline-block",
                          }}
                        >
                          {order.order_status || "PENDING"}
                        </span>
                      </td>
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <button
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#e5e7eb")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "#f3f4f6")
                          }
                        >
                          <FiEye size={14} onClick={ViewDetails(order.order.id)}/> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiPackage
              size={48}
              style={{
                opacity: 0.2,
                margin: "0 auto 16px auto",
                display: "block",
                color: "#6b7280",
              }}
            />
            <p style={{ color: "#6b7280", margin: 0, fontWeight: "500" }}>
              No recent orders.
            </p>
            {searchTerm && (
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                }}
              >
                Try adjusting your search criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
