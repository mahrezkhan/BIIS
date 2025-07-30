import React, { useState } from "react";
import axios from "../../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../css/form.module.css";

const AdminSendNoticeWithFile = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [receiverType, setReceiverType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Defined successMessage
  const [showModal, setShowModal] = useState(true); // Defined showModal state
  const token = sessionStorage.getItem("token");
  const location = useLocation();

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
      setSuccessMessage("Notice sent successfully!");
      setTitle("");
      setContent("");
      setReceiverType("");
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send notice. Please try again."
      );
    }
  };

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
          <a
            href="/admin/publishresult"
            className={
              location.pathname === "/admin/publishresult"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Publish Result
          </a>
        </nav>
      </aside>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modelh2}>Send Notice (with optional file)</h2>
            <form onSubmit={handleSubmit}>
              <label className={styles.modelh2}>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Content:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <label className={styles.modelh2}>Receiver Type:</label>
              <select
                value={receiverType}
                onChange={(e) => setReceiverType(e.target.value)}
                required
                className={styles.selectInput} // Correctly added class
              >
                <option value="">Select</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="both">Both</option>
              </select>
              <label className={styles.modelh2}>Attach File (optional):</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="*"
              />
              <div>
                {error && <div className={styles.error}>{error}</div>}
                {successMessage && (
                  <div className={styles.success}>{successMessage}</div>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button type="submit">Send Notice</button>
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

export default AdminSendNoticeWithFile;
