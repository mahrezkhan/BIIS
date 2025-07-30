import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";

const TeacherMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("/teacher/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewStudents = (courseId) => {
    navigate(`/teacher/course/${courseId}/students`);
  };

  if (loading) return <div className={styles.loading}>Loading courses...</div>;

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
      <div className={styles.Container}>
        <h2>My Courses</h2>

        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Title</th>
              <th>Action</th>
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
                  <td>
                    <button
                      onClick={() => handleViewStudents(course.course_id)}
                      >
                      View Students
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherMyCourses;
