import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/MyProfile.module.css";

const TeacherMyProfilepersonalinformation = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    Session: ''
  });
  const [initialProfile, setInitialProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get("/teacher/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data);
      setInitialProfile(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put("/teacher/edit-profile", 
        {
          name: profile.name,
          email: profile.email,
          phone_number: profile.phone,
          department: profile.department
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile(profile);
      setInitialProfile(profile);
      setIsEditing(false);
      setIsModified(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDiscardChanges = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setIsModified(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setIsModified(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

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

      <div className={styles.profileContent}>
        <h2>Personal Information</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.profileSection}>
          <h3>Personal Details</h3>
          <div className={styles.personalInfo}>
            <div className={styles.infoField}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={isEditing ? styles.editing : ''}
              />
            </div>
            <div className={styles.infoField}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={isEditing ? styles.editing : ''}
              />
            </div>
            <div className={styles.infoField}>
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={isEditing ? styles.editing : ''}
              />
            </div>
            <div className={styles.infoField}>
              <label>Department</label>
              <input
                type="text"
                value={profile.department || ''}
                readOnly
                className={styles.readonly}
              />
            </div>
            <div className={styles.infoField}>
              <label>Session</label>
              <input
                type="text"
                value={profile.Session || ''}
                readOnly
                className={styles.readonly}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          {isEditing ? (
            <>
              <button 
                className={styles.editBtn}
                onClick={handleSave}
                disabled={!isModified}>
                Save Changes
              </button>
              <button 
                className={styles.editBtn}
                onClick={handleDiscardChanges}>
                Discard Changes
              </button>
            </>
          ) : (
            <button 
              className={styles.editBtn}
              onClick={handleEditClick}>
              Edit Personal Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherMyProfilepersonalinformation;