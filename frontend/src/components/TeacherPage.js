import styles from './css/TeacherPage.module.css'; // Import the module CSS
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
    <div className={styles.teacherLogin}>
      <h2>Teacher Portal Login</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label className={styles.head}>Email:</label>
        <input className={styles.loginForm}
          type="email"
          placeholder="teacher@buet.ac.bd"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.head}>Password:</label>
        <input className={styles.loginForm}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign In</button>
      </form>

      <p className={styles.head}>
        Don't have an account?{' '}
        <span className={styles.signupLink} onClick={() => navigate('/teacher/signup')}>Create New Account</span>
      </p>
    </div>
  );
};

export default TeacherPage;
