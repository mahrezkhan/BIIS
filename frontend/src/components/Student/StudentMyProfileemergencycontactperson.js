import { useState, useEffect } from "react";
import axios from "axios"; 
import styles from "../css/MyProfile.module.css";
import { useLocation, useNavigate } from "react-router-dom";
const StudentMyProfileemergencycontactperson = () => {
  const [profile, setProfile] = useState(null);
  const [initialProfile, setInitialProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
        setProfile(response.data);
        setInitialProfile(response.data);
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
          birth_registration_no: profile["Birth Registration No"],
          birth_date: profile["Birth Date"],
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

    // Update only the modified field, and keep the rest of the fields unchanged
    setProfile((prevProfile) => ({
      ...prevProfile, // Spread the previous profile data
      [name]: value, // Update only the changed field
    }));

    setIsModified(true); // Mark the profile as modified when any field is changed
  };

  // Prompt user if they want to navigate away while editing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isModified) {
        event.preventDefault();
        event.returnValue = ''; // Display browser's default prompt
      }
    };

    // Listen for the beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModified]);


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
            Bank Account
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
          {/* Add other links as needed */}
        </nav>
      </aside>
      
      <div className={styles.profileContent}>
        <h2>Emergency Contact Person</h2>
        <div className={styles.profileSection}>
          <h3>Contact Person Information</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>Name</label>
              <input
                type="text"
                name="contact_person_name"
                value={profile.contact_person_name}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Phone Number</label>
              <input
                type="email"
                name="contact_person_mobile_number"
                value={profile.contact_person_mobile_number}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.infoField}>
              <label>Address</label>
              <input
                type="text"
                name="contact_person_address"
                value={profile.contact_person_address}
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

export default StudentMyProfileemergencycontactperson;
