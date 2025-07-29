import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/student/notices", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotices(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch notices."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [token]);

  const handleDownload = (noticeId) => {
    // This will open the file download in a new tab
    window.open(`/api/admin/download-notice/${noticeId}`, "_blank");
  };

  return (
    <div>
      <h2>Notices</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && notices.length === 0 && <p>No notices found.</p>}
      {!loading && notices.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Content</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.notice_id}>
                <td>{new Date(n.notice_date).toLocaleDateString()}</td>
                <td>{n.title}</td>
                <td>{n.content}</td>
                <td>
                  {n.file_path ? (
                    <button onClick={() => handleDownload(n.notice_id)}>
                      Download
                    </button>
                  ) : (
                    "No file"
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

export default StudentNotices;