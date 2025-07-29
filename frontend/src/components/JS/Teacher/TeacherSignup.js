import styles from "../../css/Signup.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance";

const TeacherSignup = () => {
  // Clear any existing session
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("login_id");

  const [form, setForm] = useState({
    teacherId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear messages when user types
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.email.endsWith("@buet.ac.bd")) {
      setError("Please use a BUET email address");
      return;
    }


    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/auth/signup", {
        login_id: form.teacherId,
        email: form.email,
        password: form.password,
        user_type: "teacher"
      });

      setSuccess(response.data.message);
      
      // Reset form
      setForm({
        teacherId: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/teacher/signin");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.SignupContainer}>
      <h2>Create Teacher Account</h2>
      <form onSubmit={handleSubmit} className={styles.SignupForm}>
        <label className={styles.head}>Teacher ID</label>
        <input
          type="text"
          name="teacherId"
          placeholder="Enter your teacher ID"
          value={form.teacherId}
          onChange={handleChange}
          required
        />

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
        {success && <p className={styles.success}>{success}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? styles.buttonLoading : ''}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default TeacherSignup;