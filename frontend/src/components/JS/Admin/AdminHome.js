// src/components/StudentDashboard.js
import { useLocation, useNavigate } from "react-router-dom";

import styles from "../../css/Home.module.css";

const AdminHome = () => {
  // const navigate = useNavigate();;
  const location = useLocation();
  const navigate = useNavigate();
  // Close dropdown if clicked outside
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("login_id");
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
            href="/admin/pendingteachers"
            className={
              location.pathname === "/admin/pendingteachers"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Teachers
          </a>
          <a
            href="/admin/addcourses"
            className={
              location.pathname === "/admin/addcourses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Courses
          </a>
          <a
            href="/admin/assignteacher"
            className={
              location.pathname === "/admin/assignteacher"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Assign Teacher 
          </a>
          <a
            href="/admin/pendingrequests"
            className={
              location.pathname === "/admin/pendingrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Requests
          </a>
          <a
            href="/admin/respondedrequests"
            className={
              location.pathname === "/admin/respondedrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Responded Requests
          </a>
          <a
            href="/admin/addfee"
            className={
              location.pathname === "/admin/addfee"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Fee
          </a>
          <a
            href="/admin/pendingpayments"
            className={
              location.pathname === "/admin/pendingpayments"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            pending payments
          </a>
          <a
            href="/admin/sendnotices"
            className={
              location.pathname === "/admin/sendnotices"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Send Notices
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
