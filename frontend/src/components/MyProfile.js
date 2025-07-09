import React from 'react';
import styles from './css/MyProfile.module.css';
import { useLocation } from "react-router-dom";

const MyProfile = () => {
  const location = useLocation();

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>My Profile</h2>
        <nav>
          <a
            href="/student/personalinformation"
            className={location.pathname === '/student/personalinformation' ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
          >
            Personal Information
          </a>
          <a
            href="/student/address"
            className={location.pathname === '/student/address' ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink}
          >
            Address
          </a>
          {/* Add other links as needed */}
        </nav>
      </aside>

      <div className={styles.profileContent}>
        <h2>Personal Information</h2>

        <div className={styles.profileSection}>
          <h3>Personal Details</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>Full Name</label>
              <input type="text" defaultValue="John Doe" readOnly />
            </div>
            <div className={styles.infoField}>
              <label>Email</label>
              <input type="email" defaultValue="john.doe@buet.ac.bd" readOnly />
            </div>
            <div className={styles.infoField}>
              <label>Phone Number</label>
              <input type="text" defaultValue="017XXXXXXXX" readOnly />
            </div>
            <div className={styles.infoField}>
              <label>Date of Birth</label>
              <input type="text" defaultValue="01/01/1998" readOnly />
            </div>
          </div>
        </div>

        <button className={styles.editBtn}>Edit Personal Information</button>
      </div>
    </div>
  );
};

export default MyProfile;
