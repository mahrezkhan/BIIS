import React, { useState } from "react";
import axios from "axios";
import styles from "../../css/form.module.css"; // Create this CSS file as per your design
import { useNavigate, useLocation } from "react-router-dom";

const AdminAddCourse = () => {
  const [showModal, setShowModal] = useState(true); // Show/Hide approval modal
  const [courseId, setCourseId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [levelTermId, setLevelTermId] = useState("");
  const [title, setTitle] = useState("");
  const [credit, setCredit] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const submitApproval = async (e) => {
    e.preventDefault(); // Ensure event.preventDefault() is called

    setError(""); // Reset error message

    // Validate input fields
    if (!courseId || !departmentId || !levelTermId || !title || !credit) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");

    const courseData = {
      course_id: courseId,
      department_id: departmentId,
      level_term_id: levelTermId,
      title: title,
      credit: credit,
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/api/admin/add-course",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Course added successfully.");

        // Reset all input fields
        setCourseId("");
        setDepartmentId("");
        setLevelTermId("");
        setTitle("");
        setCredit("");

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
        </nav>
      </aside>
      {showModal && (
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
              <label className={styles.modelh2}>Department ID:</label>
              <input
                type="text"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Level Term ID</label>
              <input
                type="text"
                value={levelTermId}
                onChange={(e) => setLevelTermId(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Credit</label>
              <input
                type="text"
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
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
      )}
    </div>
  );
};

export default AdminAddCourse;
