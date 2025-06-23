import './css/AdminPage.css';
import { useState } from 'react';

const AdminPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy example: You’ll later call backend here
    if (!form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    setError('');
    alert(`Logged in as Admin: ${form.email}`);
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
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

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default AdminPage;
