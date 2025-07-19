import styles from '../../css/AdminDashboard.module.css';
import {  useLocation } from "react-router-dom";

const AdminHome = () => {
  // const navigate = useNavigate();
  const location = useLocation();

  // const handleLogout = () => {
  //   // Handle logout logic
  //   localStorage.removeItem("token");
  //   navigate("/admin/login");
  // };

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
          >
            Dashboard
          </a>
          <a 
            href="/admin/users"
            className={
              location.pathname === '/admin/users'
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }
          >
            Users
          </a>
          <a
            href="/admin/settings"
            className={
              location.pathname === '/admin/settings'
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }
          >
            Settings
          </a>
        </nav>
      </aside>
    </div>
  );
};

export default AdminHome;
