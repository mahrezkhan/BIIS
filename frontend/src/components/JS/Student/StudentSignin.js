import styles from "../../css/Signin.module.css"; // Import the module CSS
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance";

const StudentSignin = () => {
  const [StudentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state for button
  const navigate = useNavigate();
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("login_id");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading state when submitting the form

    try {
      const response = await axios.post("/auth/signin", {
        login_id: StudentId,
        password: password,
        user_type: "student"
      });

      const { token } = response.data;
      const role = "student";
      // Save the token in localStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("login_id", StudentId);
      sessionStorage.setItem("role", role);

      console.log("Student ID saved:", StudentId);

      // Wait for 1 second before redirecting to the student dashboard
      setTimeout(() => {
        // Set loading state back to false after 1 second
        navigate("/student/"); // Redirect to the student page
      }, 1000); // Wait for 1 second (1000 ms)
    } catch (err) {
      setTimeout(() => {
        setError(
          err.response?.data?.message || "Server error. Please try again later."
        );
        // Set loading state back to false after 1 second
        setLoading(false); // Redirect to the student page
      }, 1000); // If there is an error, reset loading state
    }
  };

  return (
    <div>
      <div className={styles.Login}>
        <h2>Student Portal Login</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label className={styles.head}>Student ID:</label>
          <input
            type="text"
            placeholder="22XXXXX"
            value={StudentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />

          <label className={styles.head}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          {/* Button text changes to "Signing In..." when loading state is true */}
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className={styles.head}>
          Don't have an account?{" "}
          <span
            className={styles.signupLink}
            onClick={() => navigate("/student/signup")}>
            Create New Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default StudentSignin;
