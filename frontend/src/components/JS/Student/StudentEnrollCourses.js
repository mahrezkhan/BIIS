import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../css/StudentEnrollCourses.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const StudentEnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5050/api/student/available-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
      } catch (err) {
        //setError("Error fetching courses. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      setError("Please select at least one course.");
      return;
    }
    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5050/api/student/enroll",
        { selected_courses: selectedCourses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage(
          "Your enrollment request has been submitted for approval."
        );
        setSelectedCourses([]);
      }
    } catch (err) {
      setError("Error submitting enrollment request. Please try again later.");
      console.error(err);
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
        <h2 className={styles.en}>Enroll in Courses</h2>

        {isLoading ? (
          <div>Loading available courses...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            {courses.length === 0 ? (
              <div>No courses available for you at this moment.</div>
            ) : (
              <>
                <div className={styles.tableContainer}>
                  <table className={styles.pendingTable}>
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th>Course Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.course_id}>
                          <td>
                            <input
                              type="checkbox"
                              id={`course-${course.course_id}`}
                              value={course.course_id}
                              checked={selectedCourses.includes(
                                course.course_id
                              )}
                              onChange={() =>
                                handleCourseSelection(course.course_id)
                              }
                            />
                          </td>
                          <td>
                            <label htmlFor={`course-${course.course_id}`}>
                              {course.title}
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.buttonWrapper}>
                  <button
                    type="submit"
                    className={styles.approveBtn}
                    onClick={handleSubmit}>
                    Submit Enrollment
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setSelectedCourses([])}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.success}>{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollCourses;
