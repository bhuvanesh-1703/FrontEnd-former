import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import "../Admin-Css-Folder/Dashboard.css";
import { FaUsers, FaBox, FaFolderOpen, FaHourglassHalf } from "react-icons/fa";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`);
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
    { label: "Total Users", value: userCount, icon: <FaUsers />, color: "#4caf50" },
    {
      label: "Total Products",
      value: productCount,
      icon: <FaBox />,
      color: "#2196f3",
    },
    {
      label: "Total Categories",
      value: categoryCount,
      icon: <FaFolderOpen />,
      color: "#ff9800",
    },
    {
      label: "Pending Orders",
      value: pendingOrdersCount,
      icon: <FaHourglassHalf />,
      color: "#f44336",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-section">
        <h2 className="dashboard-title">Dashboard Overview</h2>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderLeft: `5px solid ${stat.color}` }}
          >
            <div className="stat-card-inner">
              <div className="stat-icon-top">{stat.icon}</div>
              <div className="stat-label-wrap">
                <span className="stat-label">{stat.label}</span>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity-section">
        <div className="activity-card">
          <div className="activity-card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-card-body">
            <p className="no-activity">No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
