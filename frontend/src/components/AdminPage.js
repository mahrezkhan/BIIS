import "./css/AdminPage.css";
import { useState } from "react";
import axios from "../api/axiosInstance";
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
      // Assuming admin login_id is their email (or adjust accordingly)
      const response = await axios.post("/auth/signin", {
        login_id: form.AdminId, // or admin id field if different
        password: form.password,
      });

      console.log("Login success:", response.data.message);
      // Save token if you want for auth
      localStorage.setItem("token", response.data.token);
      // Redirect or load admin dashboard here
      // navigate('/admin/dashboard');
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
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>AdminId</label>
        <input
          type="text"
          name="AdminId"
          value={form.AdminId}
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
