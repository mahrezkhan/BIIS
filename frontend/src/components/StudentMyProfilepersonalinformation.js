// src/components/MyProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure you have axios installed
//import { useNavigate } from 'react-router-dom';
import styles from "./css/StudentMyProfilepersonalinformation.module.css";
import { useLocation } from "react-router-dom";
const StudentMyProfilepersonalinformation = () => {
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
        <h2>Personal Information</h2>
        <div className={styles.profileSection}>
          <h3>Personal Details</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>Full Name</label>
              <input type="text" defaultValue={profile.name} readOnly />
            </div>

            <div className={styles.infoField}>
              <label>Email</label>
              <input type="email" defaultValue={profile.email} readOnly />
            </div>
            <div className={styles.infoField}>
              <label>Phone Number</label>
              <input
                type="text"
                defaultValue={profile.mobile_number}
                readOnly
              />
            </div>
            <div className={styles.infoField}>
              <label>Date of Birth</label>
              <input
                type="text"
                defaultValue={
                  profile["Birth Date"]
                    ? profile["Birth Date"].split("T")[0]
                    : ""
                }
                readOnly
              />
            </div>
            <div className={styles.infoField}>
              <label>Birth Registration No</label>
              <input
                type="text"
                defaultValue={profile["Birth Registration No"]}
                readOnly
              />
            </div>
            <div className={styles.infoField}>
              <label>NID No</label>
              <input type="text" defaultValue={profile["nid"]} readOnly />
            </div>

            {/* Add more fields as required */}
          </div>
        </div>

        <button className={styles.editBtn}>Edit Personal Information</button>
      </div>
    </div>
  );
};

export default StudentMyProfilepersonalinformation;
