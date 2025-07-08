import "./css/A.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-dashboard__sidebar">
        <h2 className="admin-dashboard__sidebar-title">Admin Panel</h2>
        <nav>
          <a
            href="/admin/dashboard"
            className="admin-dashboard__nav-link admin-dashboard__nav-link--active"
          >
            Dashboard
          </a>
          <a href="/admin/users" className="admin-dashboard__nav-link">
            Users
          </a>
          <a href="/admin/settings" className="admin-dashboard__nav-link">
            Settings
          </a>
          {/* Add more nav links */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="admin-dashboard__main">
        <header className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Dashboard</h1>
          <button
            className="admin-dashboard__logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="admin-dashboard__cards">
          <div className="admin-dashboard__card">
            <h3>Pending Approvals</h3>
            <p>12</p>
          </div>
          {/* Add more cards */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
