import './css/StudentPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentPage = () => {
  const [StudentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Just navigate directly, no API call yet
    navigate('/student/dashboard');
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
