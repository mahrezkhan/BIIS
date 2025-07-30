import React, { useState, useEffect } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useLocation } from "react-router-dom";

const StudentPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get("/student/payment-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data.payment_history || []);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch payment history"
        );
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [token]);

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
        <h2>Payment History</h2>

        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Due Code</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No payment history found.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.due_code}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.transaction_id}</td>
                  <td>{payment.amount}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        payment.payment_status === "approved"
                          ? styles.approved
                          : payment.payment_status === "rejected"
                          ? styles.rejected
                          : styles.pending
                      }`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td>{new Date(payment.payment_date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPaymentHistory;
