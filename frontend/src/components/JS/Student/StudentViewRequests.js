import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useNavigate, useLocation } from "react-router-dom";
const StudentViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [requestType, setRequestType] = useState("");
  const [requestContent, setRequestContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const [showModal, setShowModal] = useState(false); // Show/Hide approval modal

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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "/student/create-request",
        {
          request_type: requestType,
          request_content: requestContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // If successful, update the requests list
      const updatedRequests = await axios.get("/student/view-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(updatedRequests.data.requests || []);

      // Clear form and close modal
      setRequestType("");
      setRequestContent("");
      setShowModal(false);
      setSuccess("Request submitted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    }
  };

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
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6">No pending requests found.</td>
              </tr>
            ) : (
            requests.map((req) => (
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
            )))}
          </tbody>
        </table>
        <div className={styles.buttonWrapper}>
        <button
          type="submit"
          className={styles.approveBtn}
          // onClick={handleSubmit1} // Uncomment this line to show the modal
          //onClick={() => setShowModal(true)} >// Show modal on button click
          onClick={() => setShowModal(true)}>
          New Request
        </button>
      </div>
      </div>
      
      {showModal && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h2 className={styles.modelh2}>New Request</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.modelh2}>Request Type:</label>
              <input
                type="text"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.modelh2}>Request Content:</label>
              <input
                type="text"
                value={requestContent}
                onChange={(e) => setRequestContent(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            <div className={styles.modalButtons}>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default StudentViewRequests;
