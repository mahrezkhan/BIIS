import styles from './css/AdminDashboard.module.css';
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    // localStorage.removeItem("token");
    // navigate("/admin/login");
    // <nav>
    //   <a href=""></a>
    // </nav>
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
          href="/admin/dashboard"
          className={
              location.pathname === '/admin/dashboard'
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }
          >DashBoard</a>
          <a 
          href=""
          className={
              location.pathname === '/admin/dashboard'
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }
          >Users</a>
          
          

        </nav>
      </aside>
    </div>
  );
};

export default AdminDashboard;
