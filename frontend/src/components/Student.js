// src/components/StudentDashboard.js
import { useLocation } from "react-router-dom";

import styles from './css/Student.module.css';

const Student = () => {
  // const navigate = useNavigate();;
  const location = useLocation();

  // Close dropdown if clicked outside

  return (
      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebartitle}>Student Portal</h2>
          <nav>
            <a
              href="/student/myprofile"
              className={
                location.pathname === '/student/myprofile'
                  ? `${styles.navLink} ${styles.activeNavLink}`
                  : styles.navLink
              }
            >
              My Profile
            </a>
            <a 
              href="/student/dashboard"
              className={
                location.pathname === '/student/dashboard'
                  ? `${styles.navLink} ${styles.activeNavLink}`
                  : styles.navLink
              }
            >
              Users
            </a>
            <a
              href="/student/settings"
              className={
                location.pathname === '/student/settings'
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

export default Student;
