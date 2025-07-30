// src/components/StudentDashboard.js
import { useLocation, useNavigate } from "react-router-dom";

import styles from "../../css/Home.module.css";

const TeacherHome = () => {
  // const navigate = useNavigate();;
  const location = useLocation();
  const navigate = useNavigate();
  // Close dropdown if clicked outside
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("login_id");
    navigate("/teacher/signin");
  };
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Teacher Portal</h2>
        <nav>
          <a
            href="/teacher/myprofile/personalinformation"
            className={
              location.pathname === "/teacher/myprofile/personalinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            My Profile
          </a>
          <a
            href="/teacher/enrollmentrequest"
            className={
              location.pathname === "/teacher/enrollmentrequest"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Enrollment Request
          </a>
          <a
            href="/teacher/mycourses"
            className={
              location.pathname === "/teacher/mycourses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            My Courses
          </a>
        </nav>
      </aside>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TeacherHome;
