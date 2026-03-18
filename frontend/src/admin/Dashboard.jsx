import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Admin-Css-Folder/Dashboard.css";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5100/api/admin/stats");
      if (res.data.success) {
        const stats = res.data.data;
        setUserCount(stats.users);
        setProductCount(stats.products);
        setCategoryCount(stats.categories);
        setPendingOrdersCount(stats.pendingOrders);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Users", value: userCount, icon: "👥", color: "#4caf50" },
    {
      label: "Total Products",
      value: productCount,
      icon: "📦",
      color: "#2196f3",
    },
    {
      label: "Total Categories",
      value: categoryCount,
      icon: "📁",
      color: "#ff9800",
    },
    {
      label: "Pending Orders",
      value: pendingOrdersCount,
      icon: "⏳",
      color: "#f44336",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderLeft: `5px solid ${stat.color}` }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <p className="no-activity">No recent activity to show.</p>
      </div>
    </div>
  );
};

export default Dashboard;
