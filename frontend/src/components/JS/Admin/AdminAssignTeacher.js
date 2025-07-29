import React, { useState } from "react";
import axios from "axios";
import styles from "../../css/form.module.css"; // Create this CSS file as per your design
import { useNavigate, useLocation } from "react-router-dom";

const AdminAssignTeacher = () => {
  const [showModal, setShowModal] = useState(true); // Show/Hide approval modal
  const [courseId, setCourseId] = useState("");
  const [TeacherId, setTeacherId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submitApproval = async (e) => {
    e.preventDefault(); // Ensure event.preventDefault() is called

    setError(""); // Reset error message

    // Validate input fields
    if (!courseId || !TeacherId) {
      setError("All fields are require");
      return;
    }

    const token = sessionStorage.getItem("token");

    const courseData = {
      course_id: courseId,
      login_id: TeacherId,
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/api/admin/assign-teacher",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Teacher Assign successfully.");

        // Reset all input fields
        setCourseId("");
        setTeacherId("");

        // Optionally, reset error and success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
          setError("");
        }, 3000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error adding the course.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
            href="/admin/pendingstudents"
            className={
              location.pathname === "/admin/pendingstudents"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Students
          </a>
          <a
            href="/admin/pendingteachers"
            className={
              location.pathname === "/admin/pendingteachers"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Teachers
          </a>
          <a
            href="/admin/addcourses"
            className={
              location.pathname === "/admin/addcourses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Courses
          </a>
          <a
            href="/admin/assignteacher"
            className={
              location.pathname === "/admin/assignteacher"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Assign Teacher
          </a>
          <a
            href="/admin/pendingrequests"
            className={
              location.pathname === "/admin/pendingrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Requests
          </a>
          <a
            href="/admin/redpondedrequests"
            className={
              location.pathname === "/admin/respondedrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Responded Requests
          </a>
          <a
            href="/admin/addfee"
            className={
              location.pathname === "/admin/addfee"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Fee
          </a>
          <a
            href="/admin/pendingpayments"
            className={
              location.pathname === "/admin/pendingpayments"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            pending payments
          </a>
          <a
            href="/admin/sendnotices"
            className={
              location.pathname === "/admin/sendnotices"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Send Notices
          </a>
        </nav>
      </aside>
      {showModal &&
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modelh2}>Add New Course</h2>
            <form onSubmit={submitApproval}>
              {" "}
              {/* Form now properly submits the data */}
              <label className={styles.modelh2}>Course ID</label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Teacher ID:</label>
              <input
                type="text"
                value={TeacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
              />
              <div>
                {error && <div className={styles.error}>{error}</div>}
                {successMessage && (
                  <div className={styles.success}>{successMessage}</div>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button type="submit">Add Course</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  );
};

export default AdminAssignTeacher;
