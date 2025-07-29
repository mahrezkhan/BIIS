import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useNavigate, useLocation } from "react-router-dom";
const StudentViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/student/view-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebartitle}>Student Portal</h2>
        <nav>
          <a
            href="/student/myprofile/personalinformation"
            className={
              location.pathname === "/student/myprofile/personalinformation"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            My Profile
          </a>
          <a
            href="/student/enroll"
            className={
              location.pathname === "/student/enroll"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Enroll
          </a>
          <a
            href="/student/requests"
            className={
              location.pathname === "/student/requests"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Request
          </a>
          <a
            href="/student/dues"
            className={
              location.pathname === "/student/dues"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Dues
          </a>
          <a
            href="/student/notices"
            className={
              location.pathname === "/student/notices"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Notices
          </a>
          <a
            href="/student/dashboard"
            className={
              location.pathname === "/student/dashboard"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Users
          </a>
          <a
            href="/student/settings"
            className={
              location.pathname === "/student/settings"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Settings
          </a>
        </nav>
      </aside>
      <div className={styles.Container}>
        <h2>Your Requests</h2>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Type</th>
              <th>Content</th>
              <th>Date</th>
              <th>Status</th>
              <th>Responses</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.request_id}>
                <td>{req.request_id}</td>
                <td>{req.request_type}</td>
                <td>{req.request_content}</td>
                <td>{new Date(req.request_date).toLocaleString()}</td>
                <td>{req.status}</td>
                <td>
                  {req.responses && req.responses.length > 0 ? (
                    <ul>
                      {req.responses.map((resp, idx) => (
                        <li key={idx}>{resp.response_content}</li>
                      ))}
                    </ul>
                  ) : (
                    "No response yet"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentViewRequests;
