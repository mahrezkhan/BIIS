import './css/TeacherSignup.css';
import { useState } from 'react';

const TeacherSignup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

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
    alert(`Teacher account created for ${form.name}`);
  };

  return (
    <div className="teacher-signup-container">
      <h2>Create Teacher Account</h2>
      <form onSubmit={handleSubmit} className="teacher-signup-form">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Employee ID</label>
        <input
          type="text"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default TeacherSignup;
