import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";

const StudentViewCGPA = () => {
  const [levelTerms, setLevelTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [cgpaData, setCgpaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchLevelTerms();
  }, []);

  const fetchLevelTerms = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/student/view-level-term-for-grade", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLevelTerms(response.data.level_terms || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch level terms");
    } finally {
      setLoading(false);
    }
  };

  const fetchCGPA = async (levelTermId) => {
    setLoading(true);
    setCgpaData(null);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `/student/view-cgpa-for-level-term?level_term_id=${levelTermId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCgpaData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch CGPA data");
    } finally {
      setLoading(false);
    }
  };

  const handleTermChange = (e) => {
    const termId = e.target.value;
    setSelectedTerm(termId);
    if (termId) {
      fetchCGPA(termId);
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

      <div className={styles.Container}>
        <h2>View CGPA by Level-Term</h2>
        <div className={styles.filterSection}>
          <select
            value={selectedTerm}
            onChange={handleTermChange}
            className={styles.select}
            disabled={loading || levelTerms.length === 0}>
            <option value="">Select Level-Term</option>
            {levelTerms.map((term) => (
              <option key={term.level_term_id} value={term.level_term_id}>
                Level {term.level} Term {term.term}
              </option>
            ))}
          </select>
        </div>
        {cgpaData && (
          <div className={styles.cgpaContainer}>
            <table className={styles.Table}>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {cgpaData.length === 0 ? (
                  <tr>
                    <td colSpan="3">No CGPA data found.</td>
                  </tr>
                ) : (
                  cgpaData.courses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.course_id}</td>
                      <td>{course.course_title}</td>
                      <td>
                        {typeof course.course_cgpa === "number"
                          ? course.course_cgpa.toFixed(2)
                          : parseFloat(course.course_cgpa || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className={styles.cgpaSummary}>
              <h3>
                Total CGPA:{" "}
                <span>
                  {typeof cgpaData.total_cgpa === "number"
                    ? cgpaData.total_cgpa.toFixed(2)
                    : parseFloat(cgpaData.total_cgpa || 0).toFixed(2)}
                </span>
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentViewCGPA;
