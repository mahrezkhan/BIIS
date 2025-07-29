import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import AdminReplyRequest from "./AdminReplyRequest";
import styles from "../../css/EnrollmentRequests.module.css";

const AdminPendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyRequestId, setReplyRequestId] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/admin/view-pending-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.requests || []);
        setError("");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setRequests([]);
          setError("");
        } else {
          setError("Failed to fetch pending requests.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  // After reply, refresh the list and close the reply form
  const handleReplySuccess = () => {
    setReplyRequestId(null);
    setLoading(true);
    axios
      .get("/admin/view-pending-requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data.requests || []))
      .catch(() => setError("Failed to fetch pending requests."))
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.dashboard1}>
      <h2>Pending Requests</h2>
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && requests.length === 0 && (
        <p className={styles.noData}>No pending requests found.</p>
      )}
      {!loading && requests.length > 0 && (
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student ID</th>
              <th>Request Type</th>
              <th>Request Content</th>
              <th>Date</th>
              <th>Status</th>
              <th>Reply</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.request_id}>
                <td>{req.request_id}</td>
                <td>{req.student_login_id || req.login_id}</td>
                <td>{req.request_type}</td>
                <td>{req.request_content}</td>
                <td>{new Date(req.request_date).toLocaleString()}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => setReplyRequestId(req.request_id)}>
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Show reply form if a request is selected */}
      {replyRequestId && (
        <div style={{ marginTop: "2rem" }}>
          <AdminReplyRequest
            requestId={replyRequestId}
            onSuccess={handleReplySuccess}
            onCancel={() => setReplyRequestId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPendingRequest;
