import './css/StudentPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation

const StudentPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as: ${email}`);
    // later: send login request to backend
  };

  return (
    <div className="student-login">
      <h2>Student Portal Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email:</label>
        <input
          type="email"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
