import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useLocation, useNavigate } from "react-router-dom";
const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");
  const location = useLocation();

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
        setError(err.response?.data?.message || "Failed to fetch notices.");
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
            href="/student/paymenthistory"
            className={
              location.pathname === "/student/paymenthistory"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            Payment History
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
            href="/student/viewcgpa"
            className={
              location.pathname === "/student/viewcgpa"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            View CGPA
          </a>
          <a
            href="/student/courses"
            className={
              location.pathname === "/student/courses"
                ? `${styles.navLink} ${styles.activeNavLink}`
                : styles.navLink
            }>
            View Courses
          </a>
        </nav>
      </aside>
      <div className={styles.Container}>
        <h2>Notices</h2>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Content</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="4">No notices found.</td>
              </tr>
            ) : (
              notices.map((n) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentNotices;
