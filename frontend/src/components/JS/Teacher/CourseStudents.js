import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";

const CourseStudents = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `/teacher/course/${courseId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleAddMarks = (studentId) => {
    navigate(`/teacher/course/${courseId}/add-marks`, {
      state: { studentId },
    });
  };

  if (loading) return <div className={styles.loading}>Loading students...</div>;

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
        <h2>Students in {courseId}</h2>

        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>CT Marks</th>
              <th>TF Marks</th>
              <th>Attendance Marks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5">No students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.login_id}>
                  <td>{student.login_id}</td>
                  <td>{student["CT Marks"] || "Not added"}</td>
                  <td>{student["TF Marks"] || "Not added"}</td>
                  <td>{student["Attendance Marks"] || "Not added"}</td>
                  <td>
                    <button
                      onClick={() => handleAddMarks(student.login_id)}
                      className={styles.addMarksBtn}>
                      Add/Update Marks
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

export default CourseStudents;
