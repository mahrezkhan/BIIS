import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/EnrollmentRequests.module.css";

const AdminRespondedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/admin/view-responded-requests", {
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
          setError(
            err.response?.data?.message || "Failed to fetch responded requests."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div className={styles.dashboard1}>
      <h2>Responded Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && requests.length === 0 && (
        <p>No responded requests found.</p>
      )}
      {!loading && requests.length > 0 && (
        <table className={styles.requestTable}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student ID</th>
              <th>Request Type</th>
              <th>Request Content</th>
              <th>Response</th>
              <th>Date</th>
              <th>Status</th>
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
                <td>{req.response_content || "No response"}</td> {/* Add this */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRespondedRequests;