import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axiosInstance';
import styles from '../../css/Table.module.css';

const TeacherMyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/teacher/my-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
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
    <div className={styles.Container}>
      <h2>My Courses</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <table className={styles.Table}>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td>{course.course_id}</td>
              <td>{course.title}</td>
              <td>
                <button
                  onClick={() => handleViewStudents(course.course_id)}
                  className={styles.viewBtn}
                >
                  View Students
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherMyCourses;