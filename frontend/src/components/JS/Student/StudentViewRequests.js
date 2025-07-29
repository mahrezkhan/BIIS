import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";

const StudentViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/student/view-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests || []);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch requests."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div>
      <h3>Your Requests</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && requests.length === 0 && <p>No requests found.</p>}
      {!loading && requests.length > 0 && (
        <table border="1" cellPadding="8">
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
      )}
    </div>
  );
};

export default StudentViewRequests;