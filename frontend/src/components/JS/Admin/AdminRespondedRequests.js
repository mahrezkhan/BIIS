import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useLocation, useNavigate } from "react-router-dom";
const AdminRespondedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/admin/view-responded-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
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
      <div className={styles.Container}>
        <h2>Responded Requests</h2>
        <table className={styles.Table}>
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
                <td>{req.response_content || "No response"}</td>
                <td>{new Date(req.request_date).toLocaleString()}</td>
                <td>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRespondedRequests;
