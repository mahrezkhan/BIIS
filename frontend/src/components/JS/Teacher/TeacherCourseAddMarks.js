import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../../api/axiosInstance';
import styles from '../../css/form.module.css';

const TeacherCourseAddMarks = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = location.state?.studentId;

  const [formData, setFormData] = useState({
    student_id: studentId || '',
    CT_marks: '',
    TF_marks: '',
    attendance_marks: '',
    total_possible_marks: '400'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    console.log('Sending request with data:', {
      courseId,
      ...formData
    });
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `/teacher/${courseId}/add-marks`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(response.data.message);
      // Reset form
      setFormData({
        student_id: '',
        CT_marks: '',
        TF_marks: '',
        attendance_marks: '',
        total_possible_marks: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add Marks for Course {courseId}</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Student ID:</label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            placeholder="Enter student ID"
          />
        </div>

        <div className={styles.formGroup}>
          <label>CT Marks:</label>
          <input
            type="number"
            name="CT_marks"
            value={formData.CT_marks}
            onChange={handleChange}
            min="0"
            max="80"
            step="0.01"
            placeholder="Enter CT marks"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Term Final Marks:</label>
          <input
            type="number"
            name="TF_marks"
            value={formData.TF_marks}
            onChange={handleChange}
            min="0"
            max="280"
            step="0.01"
            placeholder="Enter term final marks"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Attendance Marks:</label>
          <input
            type="number"
            name="attendance_marks"
            value={formData.attendance_marks}
            onChange={handleChange}
            min="0"
            max="40"
            step="0.01"
            placeholder="Enter attendance marks"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Total Possible Marks:</label>
          <input
            type="number"
            name="total_possible_marks"
            value={formData.total_possible_marks}
            onChange={handleChange}
            min="0"
            required
            placeholder="Enter total possible marks"
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Adding Marks...' : 'Add Marks'}
        </button>
      </form>
    </div>
  );
};

export default TeacherCourseAddMarks;