import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axiosInstance";
import styles from "../../css/form.module.css";

const AdminPublishResult = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("/admin/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.sessions) {
        // Sort sessions by name in descending order (most recent first)
        const sortedSessions = response.data.sessions.sort((a, b) =>
          b.session_name.localeCompare(a.session_name)
        );
        setSessions(sortedSessions);
      }
    } catch (err) {
      setError(
        "Failed to fetch sessions: " +
          (err.response?.data?.message || "Unknown error")
      );
    } finally {
      setFetchingData(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedSession) {
      setError("Please select a session");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "/admin/publish-result",
        { session_name: selectedSession },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      // Refresh sessions list after publishing
      await fetchSessions();
      setSelectedSession("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish results");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebartitle}>Admin Portal</h2>
          <nav>{/* ... existing navigation ... */}</nav>
        </aside>
        <div className={styles.mainContent}>
          <div className={styles.loading}>Loading sessions data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Admin Portal</h2>
        <nav>
          <a
            href="/admin/pendingstudents"
            className={
              location.pathname === "/admin/pendingstudents"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Students
          </a>
          <a
            href="/admin/pendingteachers"
            className={
              location.pathname === "/admin/pendingteachers"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Teachers
          </a>
          <a
            href="/admin/addcourses"
            className={
              location.pathname === "/admin/addcourses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Courses
          </a>
          <a
            href="/admin/assignteacher"
            className={
              location.pathname === "/admin/assignteacher"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Assign Teacher
          </a>
          <a
            href="/admin/pendingrequests"
            className={
              location.pathname === "/admin/pendingrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Pending Requests
          </a>
          <a
            href="/admin/respondedrequests"
            className={
              location.pathname === "/admin/respondedrequests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Responded Requests
          </a>
          <a
            href="/admin/addfee"
            className={
              location.pathname === "/admin/addfee"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Add Fee
          </a>
          <a
            href="/admin/pendingpayments"
            className={
              location.pathname === "/admin/pendingpayments"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            pending payments
          </a>
          <a
            href="/admin/sendnotices"
            className={
              location.pathname === "/admin/sendnotices"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Send Notices
          </a>
          <a
            href="/admin/publishresult"
            className={
              location.pathname === "/admin/publishresult"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Publish Result
          </a>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h2>Publish Session Results</h2>

          {sessions.length === 0 && !error ? (
            <div className={styles.noData}>No sessions available</div>
          ) : (
            <form onSubmit={handlePublish} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Select Session:</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  required
                  className={styles.select}
                  disabled={loading}>
                  <option value="">Choose a session</option>
                  {sessions.map((session) => (
                    <option
                      key={session.session_name}
                      value={session.session_name}>
                      {session.session_name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !selectedSession}>
                {loading ? "Publishing..." : "Publish Results"}
              </button>
            </form>
          )}

          <div className={styles.infoBox}>
            <h3>Important Notes:</h3>
            <ul>
              <li>
                Ensure all marks have been entered for the selected session
              </li>
              <li>This action cannot be undone</li>
              <li>
                Students will be able to view their results after publishing
              </li>
              <li>Make sure to verify all grades before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPublishResult;
