import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";

const StudentViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/student/view-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses || []);
      setError("");
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to fetch courses");
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

      <div className={styles.Container}>
        <h2>My Courses</h2>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
              <tr>
                <td colSpan="3">No courses found.</td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.course_id}>
                  <td>{course.course_id}</td>
                  <td>{course.title}</td>
                  <td>{course.credit}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      
    </div>
  );
};

export default StudentViewCourses;
