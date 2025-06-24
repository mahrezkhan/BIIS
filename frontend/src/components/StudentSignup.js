// src/components/StudentSignup.js
import './css/StudentSignup.css';
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const StudentSignup = () => {
  const [form, setForm] = useState({
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log("Submitting signup form...");
      const res = await axios.post('/auth/signup', {
        login_id: form.studentId,
        email: form.email,
        password: form.password,
        user_type: 'student'
      });
      console.log("after signup form...");
      //setSuccess(res.data.message);
      setError('');
      console.log(res.data); 
      // Redirect to login page after short delay
      //setTimeout(() => navigate('/student'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      console.log("catch signup form...");
      setSuccess('');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Student Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label>Student ID</label>
        <input
          type="text"
          name="studentId"
          placeholder="22XXXXX"
          value={form.studentId}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="student@buet.ac.bd"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StudentSignup;
