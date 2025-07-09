// src/components/StudentDashboard.js
import { useState, useEffect, useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";

import styles from './css/Student.module.css';

const Student = () => {
  const [showMenu, setShowMenu] = useState(false);
  // const navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();
  // const handleProfileClick = () => {
  //   setShowMenu(false);
  //   navigate("/student/profile");
  // };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
