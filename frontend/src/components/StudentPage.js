import "./css/StudentPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const StudentPage = () => {
  const [StudentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    setError("");
    try {
      console.log({ login_id: StudentId, password: password });
      const response = await axios.post("/auth/signin", {
        login_id: StudentId,
        password: password,
      });

      const { token } = response.data;
      console.log(response.data.message);
      // Save token to localStorage
      localStorage.setItem("token", token);

      // Redirect to student dashboard
      navigate("/student/dashboard");
    } catch (err) {
      // If the backend sends an error response (like 400, 401, 403)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again later.");
      }
    }
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>

      <p className="signup-link">
        Don't have an account?{" "}
        <span onClick={() => navigate("/student/signup")}>
          Create New Account
        </span>
      </p>
    </div>
  );
};

export default StudentPage;
