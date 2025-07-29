import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../css/MyProfile.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const StudentMyProfilepersonalinformation = () => {
  const [profile, setProfile] = useState(null);
  const [initialProfile, setInitialProfile] = useState(null); // To track initial values
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle between edit mode and view mode
  const [isModified, setIsModified] = useState(false); // Track if any changes are made
  const location = useLocation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5050/api/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedProfile = { ...response.data };
        if (updatedProfile.birth_date) {
          updatedProfile.birth_date = updatedProfile.birth_date.split("T")[0]; // Correctly format birth_date
        }
        setProfile(updatedProfile);
        setInitialProfile(updatedProfile);
        console.log(updatedProfile);
      } catch (err) {
        setError("An error occurred while fetching your profile.");
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("No token found. Please log in.");
    }
  }, [token]);

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle save button click
  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:5050/api/student/edit-profile", // Adjusted the URL here
        {
          name: profile.name,
          email: profile.email,
          mobile_number: profile.mobile_number,
          district: profile.district,
          upazilla: profile.upazilla,
          additional_address: profile.additional_address,
          contact_person_name: profile.contact_person_name,
          contact_person_address: profile.contact_person_address,
          contact_person_mobile_number: profile.contact_person_mobile_number,
          birth_registration_no: profile.birth_registration_no,
          birth_date: profile.birth_date,
          nid: profile.nid,
          bank_account_number: profile.bank_account_number,
          mobile_banking_method: profile.mobile_banking_method,
          mobile_banking_account: profile.mobile_banking_account,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false); // Exit edit mode after saving
      setInitialProfile(profile); // Update initial profile with the saved data
      setIsModified(false); // Reset modification state
      alert("Profile updated successfully!");

      // Return to the same page after saving
      navigate(location.pathname, { replace: true }); // `replace: true` will prevent pushing a new entry into the history
    } catch (err) {
      setError("Error updating the profile.");
    }
  };

  // Handle discard changes button click
  const handleDiscardChanges = () => {
    setProfile(initialProfile); // Reset profile to initial values
    setIsEditing(false); // Exit edit mode
    setIsModified(false); // Reset modification state
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Field name:", name, "Value:", value); // Debugging
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setIsModified(true);
  };

  // Prompt user if they want to navigate away while editing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        event.preventDefault();
        event.returnValue = ""; // Display browser's default prompt
      }
    };

    // Listen for the beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModified]);

  // Render error or loading state if profile data is not yet loaded
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
            href="/student/myprofile/hall"
            className={
              location.pathname === "/student/myprofile/hall"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Hall
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
          <a
            href="/student/myprofile/emergencycontactperson"
            className={
              location.pathname === "/student/myprofile/emergencycontactperson"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Emergency Contact Person
          </a>
        </nav>
      </aside>

      <div className={styles.profileContent}>
        <h2>Personal Information</h2>
        <div className={styles.profileSection}>
          <h3>Personal Details</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Phone Number</label>
              <input
                type="text"
                name="mobile_number"
                value={profile.mobile_number}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="birth_date"
                value={profile.birth_date}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Birth Registration No</label>
              <input
                type="text"
                name="birth_registration_no"
                value={profile.birth_registration_no}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>NID No</label>
              <input
                type="text"
                name="nid"
                value={profile.nid}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Show Save and Discard buttons if editing */}
        {isEditing ? (
          <div>
            <button className={styles.editBtn} onClick={handleSave}>
              Save Changes
            </button>
            <button className={styles.editBtn} onClick={handleDiscardChanges}>
              Discard Changes
            </button>
          </div>
        ) : (
          <button className={styles.editBtn} onClick={handleEditClick}>
            Edit Personal Details
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentMyProfilepersonalinformation;
