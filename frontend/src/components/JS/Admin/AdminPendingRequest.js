import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const AdminPendingRequest = () => {
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedreq, setSelectedreq] = useState(null);
  const [responseContent, setResponseContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/view-pending-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data.requests || []);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/admin/signin");
        return;
      }
      setError(
        err.response?.data?.message || "Failed to fetch pending requests."
      );
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSuccess("");

    if (!selectedreq) {
      setError("No request selected");
      return;
    }

    try {
      await axios.post(
        "/admin/reply-request",
        {
          request_id: selectedreq.request_id,
          response_content: responseContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Response submitted successfully!");

      // Reset form and refresh data after delay
      setTimeout(() => {
        setShowModal(false);
        setResponseContent("");
        setSelectedreq(null);
        fetchRequests();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit response.");
    }
  };

  const done = (req) => {
    setSelectedreq(req);
    setShowModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
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
        </nav>
      </aside>

      <div className={styles.Container}>
        <h2>Pending Requests</h2>


        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student ID</th>
              <th>Request Type</th>
              <th>Request Content</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7">No pending requests found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.request_id}>
                  <td>{req.request_id}</td>
                  <td>{req.student_login_id || req.login_id}</td>
                  <td>{req.request_type}</td>
                  <td>{req.request_content}</td>
                  <td>{new Date(req.request_date).toLocaleString()}</td>
                  <td>{req.status}</td>
                  <td>
                    <button
                      className={styles.replyBtn}
                      onClick={() => done(req)}>
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showModal && selectedreq && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2 className={styles.modelh2}>
                Reply to Request #{selectedreq.request_id}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.modelh2}>Response:</label>
                  <input
                    type="text"
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    required
                    rows={4}
                    placeholder="Enter your response..."
                  />
                </div>

                
                {success && <p className={styles.success}>{success}</p>}

                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.submitBtn}>
                    Submit
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingRequest;
