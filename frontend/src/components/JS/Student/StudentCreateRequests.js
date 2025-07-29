import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

const StudentCreateRequest = ({ onSuccess }) => {
  const [requestType, setRequestType] = useState("");
  const [requestContent, setRequestContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(
        "/student/create-request",
        {
          request_type: requestType,
          request_content: requestContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Request submitted successfully!");
      setRequestType("");
      setRequestContent("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit request."
      );
    }
  };

  return (
    <div>
      <h3>Send New Request</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Request Type:</label>
          <input
            type="text"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Request Content:</label>
          <textarea
            value={requestContent}
            onChange={(e) => setRequestContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default StudentCreateRequest;