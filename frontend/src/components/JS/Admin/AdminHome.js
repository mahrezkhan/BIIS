// src/components/StudentDashboard.js
import { useLocation, useNavigate } from "react-router-dom";

import styles from "../../css/Home.module.css";

const AdminHome = () => {
  // const navigate = useNavigate();;
  const location = useLocation();
  const navigate = useNavigate();
  // Close dropdown if clicked outside
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("login_id");
    navigate("/admin/signin");
  };
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
            href="/admin/pendingstudents"
            className={
              location.pathname === "/admin/pendingstudents"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Students
          </a>
          <a
            href="/student/dashboard"
            className={
              location.pathname === "/student/dashboard"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Users
          </a>
          <a
            href="/student/settings"
            className={
              location.pathname === "/student/settings"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Settings
          </a>
        </nav>
      </aside>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminHome;
