import React from "react";
import AccessCard from "./AccessCard"; // Ensure correct import path
import styles from './css/LandingPage.module.css'; // Import the modular CSS file

const LandingPage = () => {
  return (
    <div className={styles.landingContainer}>
      {/* BUET Title */}
      <div className={styles.buetTitle}>BUET</div>

      {/* Welcome Message */}
      <div className={styles.welcomeMessage}>
        Welcome to BUET INSTITUTIONAL INFORMATION SYSTEM
      </div>

      {/* Access Cards */}
      <div className={styles.accessCardContainer}>
        <AccessCard role="Teacher Portal" onClick={() => alert("Teacher Portal Clicked")} />
        <AccessCard role="Student Portal" onClick={() => alert("Student Portal Clicked")} />
        <AccessCard role="Administrative Portal" onClick={() => alert("Admin Portal Clicked")} />
      </div>
    </div>
  );
};

export default LandingPage;
