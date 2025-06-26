import styles from './css/AdminDashboard.module.css';
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarh2}>Admin Portal</h2>
      </div>
    </div>
  );
};

export default AdminDashboard;
