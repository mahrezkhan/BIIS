import styles from '../css/Signup.module.css';  // Import the module CSS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TeacherSignup = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different pages

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    // Later: send to backend
    alert(`Teacher account created for ${form.email}`);

    // Navigate to TeacherPage or any other page after signup
    navigate('/teacher'); // Redirect to TeacherPage after successful sign-up
  };

  return (
    <div className={styles.SignupContainer}>
      <h2>Create Teacher Account</h2>
      <form onSubmit={handleSubmit} className={styles.SignupForm}>

        <label className={styles.head}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="teacher@buet.ac.bd"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className={styles.head}>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label className={styles.head}>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default TeacherSignup;
