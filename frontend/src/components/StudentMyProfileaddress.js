// src/components/MyProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure you have axios installed
//import { useNavigate } from 'react-router-dom';
import styles from "./css/StudentMyProfilepersonalinformation.module.css";
import { useLocation } from "react-router-dom";
const StudentMyProfileaddress = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  //const navigate = useNavigate();
  const location = useLocation();
  // Fetching token from localStorage
  const token = localStorage.getItem("token");
  // Check if the token exists, if not, redirect to login

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("hi");
        const response = await axios.get(
          "http://localhost:5050/api/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Sending token in the header
            },
          }
        );
        console.log(response.data);
        setProfile(response.data); // Store profile data
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching your profile."
        );
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("No token found. Please log in.");
    }
  }, [token]);

  // Render loading, error, or profile data
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!profile) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>My Profile</h2>
        <nav>
          <a
            href="/student/myprofile/personalinformation"
            className={
              location.pathname === "/student/myprofile/personalinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Personal Information
          </a>
          <a
            href="/student/myprofile/address"
            className={
              location.pathname === "/student/myprofile/address"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Address
          </a>
          <a
            href="/student/myprofile/bankaccountinformation"
            className={
              location.pathname === "/student/myprofile/bankaccountinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Bank Account Information
          </a>
          {/* Add other links as needed */}
        </nav>
      </aside>

      <div className={styles.profileContent}>
        <h2>Address</h2>
        <div className={styles.profileSection}>
          <h3>Residential Address</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>District</label>
              <input type="text" defaultValue={profile.district} readOnly />
            </div>

            <div className={styles.infoField}>
              <label>Upazilla</label>
              <input type="email" defaultValue={profile.upazilla} readOnly />
            </div>
            <div className={styles.infoField}>
              <label>Address Line</label>
              <input
                type="text"
                defaultValue={profile.additional_address}
                readOnly
              />
            </div>
            
            {/* Add more fields as required */}
          </div>
        </div>

        <button className={styles.editBtn}>Edit Personal Information</button>
      </div>
    </div>
  );
};

export default StudentMyProfileaddress;
