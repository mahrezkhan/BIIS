import './css/StudentPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance'; // use axios instance

const StudentPage = () => {
  const [StudentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/signin', {
        login_id: StudentId,
        password: password
      });

      // Get token and message
      const { token, message } = response.data;

      // ✅ Store token (for later API access)
      localStorage.setItem('token', token);

      // Navigate to student dashboard (placeholder route)
      navigate('/student/dashboard');

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // Show backend message (invalid ID, password, etc.)
      } else {
        setError('Server error. Try again later.');
      }
    }
  };

  return (
    <div className="student-login">
      <h2>Student Portal Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Student ID:</label>
        <input
          type="text"
          placeholder="22XXXXX"
          value={StudentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign In</button>
      </form>

      <p className="signup-link">
        Don't have an account?{' '}
        <span onClick={() => navigate('/student/signup')}>Create New Account</span>
      </p>
    </div>
  );
};

export default StudentPage;
