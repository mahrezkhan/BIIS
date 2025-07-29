import React, { useState, useEffect } from "react";
import axios from "../../../api/axiosInstance";

const AdminReplyRequest = ({ requestId, onSuccess, onCancel }) => {
  const [responseContent, setResponseContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    setResponseContent("");
    setMessage("");
    setError("");
  }, [requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(
        "/admin/reply-request",
        {
          request_id: requestId,
          response_content: responseContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Response submitted successfully!");
      setResponseContent("");
      // Wait 1 second before calling onSuccess
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Reply to Request #{requestId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Response:</label>
          <textarea
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Response</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminReplyRequest;
