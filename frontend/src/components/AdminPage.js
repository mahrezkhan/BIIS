import styles from './css/AdminPage.module.css';  // Import the module CSS
import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [form, setForm] = useState({ AdminId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.AdminId || !form.password) {
      setError("All fields are required");
      return;
    }

    setError("");
    try {
      const response = await axios.post("/auth/signin", {
        login_id: form.AdminId, // admin id
        password: form.password,
      });

      console.log("Login success:", response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className={styles.adminLogin}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label className={styles.head}>Email:</label>
        <input
          type="text"
          placeholder="admin@buet.ac.bd"
          name="AdminId"
          value={form.AdminId}
          onChange={handleChange}
          required
        />

        <label className={styles.head}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default AdminPage;
