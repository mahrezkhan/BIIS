import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";

const StudentViewCGPA = () => {
  const [cgpaData, setCgpaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const location = useLocation();

  const levelTerms = [
    { id: "1-1", label: "Level 1 Term 1" },
    { id: "1-2", label: "Level 1 Term 2" },
    { id: "2-1", label: "Level 2 Term 1" },
    { id: "2-2", label: "Level 2 Term 2" },
    { id: "3-1", label: "Level 3 Term 1" },
    { id: "3-2", label: "Level 3 Term 2" },
    { id: "4-1", label: "Level 4 Term 1" },
    { id: "4-2", label: "Level 4 Term 2" },
  ];

  const handleTermSelect = async (e) => {
    const termId = e.target.value;
    setSelectedTerm(termId);
    if (!termId) return;

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `/student/view-cgpa-for-level-term?level_term_id=${termId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCgpaData(response.data);
      console.log("CGPA Data:", response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch CGPA data");
      setCgpaData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Student Portal</h2>
        <nav>
          <a
            href="/student/myprofile/personalinformation"
            className={
              location.pathname === "/student/myprofile/personalinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            My Profile
          </a>
          <a
            href="/student/enroll"
            className={
              location.pathname === "/student/enroll"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Enroll
          </a>
          <a
            href="/student/requests"
            className={
              location.pathname === "/student/requests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Request
          </a>
          <a
            href="/student/dues"
            className={
              location.pathname === "/student/dues"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Dues
          </a>
          <a
            href="/student/paymenthistory"
            className={
              location.pathname === "/student/paymenthistory"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Payment History
          </a>
          <a
            href="/student/notices"
            className={
              location.pathname === "/student/notices"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Notices
          </a>
          <a
            href="/student/viewcgpa"
            className={
              location.pathname === "/student/viewcgpa"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            View CGPA
          </a>
          <a
            href="/student/courses"
            className={
              location.pathname === "/student/courses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            View Courses
          </a>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h2>View CGPA by Level-Term</h2>
          <div className={styles.termSelector}>
            <select
              value={selectedTerm}
              onChange={handleTermSelect}
              className={styles.select}>
              <option value="">Select Level-Term</option>
              {levelTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className={styles.loading}>Loading CGPA data...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {cgpaData && (
          <div className={styles.cgpaContainer}>
            <div className={styles.cgpaSummary}>
              <h3>
                Term CGPA:{" "}
                <span>{cgpaData.term_cgpa?.toFixed(2) || "N/A"}</span>
              </h3>
              <h3>
                Cumulative CGPA:{" "}
                <span>{cgpaData.cumulative_cgpa?.toFixed(2) || "N/A"}</span>
              </h3>
            </div>

            {cgpaData.courses && cgpaData.courses.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credit</th>
                    <th>Grade</th>
                    <th>Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {cgpaData.courses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.course_id}</td>
                      <td>{course.course_title}</td>
                      <td>{course.credit}</td>
                      <td>{course.grade}</td>
                      <td>{course.grade_point?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noCourses}>No courses found for this term</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentViewCGPA;
