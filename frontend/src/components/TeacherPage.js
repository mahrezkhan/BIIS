import './css/TeacherPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as teacher: ${email}`);
    // Later: add backend login logic
  };

  return (
    <div className="teacher-login">
      <h2>Teacher Portal Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email:</label>
        <input
          type="email"
          placeholder="teacher@buet.ac.bd"
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
        Don’t have an account?{' '}
        <span onClick={() => navigate('/teacher/signup')}>Create New Account</span>
      </p>
    </div>
  );
};

export default TeacherPage;
