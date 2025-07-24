import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../css/StudentEnrollCourses.module.css"; // CSS file for your design
import { useNavigate } from "react-router-dom";

const StudentEnrollCourses = () => {
  const [courses, setCourses] = useState([]); // Store available courses
  const [selectedCourses, setSelectedCourses] = useState([]); // Store selected courses
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch available courses when the component is mounted
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Send GET request to the backend to fetch available courses
        const response = await axios.get("http://localhost:5050/api/student/available-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data); // Set the available courses in state
      } catch (err) {
        setError("Error fetching courses. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses(); // Fetch available courses
  }, []);

  // Handle course selection/deselection
  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId) // Remove course from selected courses if already selected
        : [...prev, courseId] // Add course to selected courses
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCourses.length === 0) {
      setError("Please select at least one course.");
      return;
    }

    try {
      setError(""); // Clear any previous error message
      const token = localStorage.getItem("token");

      // Send POST request to the backend to submit the enrollment request
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
        setSuccessMessage("Your enrollment request has been submitted for approval.");
        setSelectedCourses([]); // Clear selected courses after submission
      }
    } catch (err) {
      setError("Error submitting enrollment request. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h2>Enroll in Courses</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.courseList}>
          {isLoading ? (
            <div>Loading available courses...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <div>
              <h3>Select Your Courses</h3>
              {courses.length === 0 ? (
                <div>No courses available for you at this moment.</div>
              ) : (
                <div>
                  {courses.map((course) => (
                    <div key={course.course_id} className={styles.courseItem}>
                      <input
                        type="checkbox"
                        id={`course-${course.course_id}`}
                        value={course.course_id}
                        onChange={() => handleCourseSelection(course.course_id)}
                      />
                      <label htmlFor={`course-${course.course_id}`}>{course.title}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.error}>{error}</div>
        {successMessage && <div className={styles.success}>{successMessage}</div>}

        <button type="submit" className={styles.submitButton}>
          Submit Enrollment Request
        </button>
      </form>

      <button className={styles.cancelButton} onClick={() => navigate("/student/dashboard")}>
        Cancel
      </button>
    </div>
  );
};

export default StudentEnrollCourses;
