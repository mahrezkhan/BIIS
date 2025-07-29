import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

const AdminSendNoticeWithFile = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [receiverType, setReceiverType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("receiver_type", receiverType);
    if (file) formData.append("file", file);

    try {
      await axios.post("/admin/send-notice-with-file", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Notice sent successfully!");
      setTitle("");
      setContent("");
      setReceiverType("");
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send notice. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Send Notice (with optional file)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Receiver Type:</label>
          <select
            value={receiverType}
            onChange={(e) => setReceiverType(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label>Attach File (optional):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="*"
          />
        </div>
        <button type="submit">Send Notice</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminSendNoticeWithFile;