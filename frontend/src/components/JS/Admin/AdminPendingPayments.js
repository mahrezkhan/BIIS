import React, { useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/form.module.css";
import styles1 from "../../css/Table.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const AdminPendingPayments = () => {
  const [feeType, setFeeType] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [on, setOn] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    setPayments([]);
    try {
      const res = await axios.get(
        `/admin/pending-payments?fee_type=${feeType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const key = `${feeType}_pending`;
      setPayments(res.data[key] || []);
      setShowModal(false);
      setOn(true);
    } catch (err) {
      setPayments([]);
      setError(
        err.response?.data?.message || "Failed to fetch pending payments."
      );
      if (err.response?.status === 404) {
        console.error("Error fetching pending payments:", err);
      } else {
        console.log("hi");
      }
    }
  };

  const handleFetch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleApproveReject = async (payment_id, approval_status) => {
    setActionMessage("");
    try {
      await axios.post(
        "/admin/approve-payment",
        { payment_id, approval_status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage(
        approval_status === "approve"
          ? "Payment approved successfully!"
          : "Payment rejected."
      );
      // Refresh the payments list
      fetchPayments();
    } catch (err) {
      setActionMessage(
        err.response?.data?.message || "Failed to process payment."
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
            <h2 className={styles.modelh2}>View Pending Payments</h2>
            <form onSubmit={handleFetch}>
              {" "}
              {/* Form now properly submits the data */}
              <label className={styles.modelh2}>Fee Type:</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                required
                className={styles.selectInput} // Add this class
              >
                <option value="">Select Fee Type</option>
                <option value="hall_fee">Hall Fee</option>
                <option value="dining_fee">Dining Fee</option>
                <option value="registration_fee">Registration Fee</option>
              </select>
              <div>
                {error && <div className={styles.error}>{error}</div>}
                {successMessage && (
                  <div className={styles.success}>{successMessage}</div>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!showModal && on && (
        <div className={styles1.Container}>
          <table className={styles1.Table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Due Code</th>
                <th>Student ID</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="10">No pending payments found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.payment_id}>
                    <td>{p.payment_id}</td>
                    <td>{p.due_code}</td>
                    <td>{p.login_id}</td>
                    <td>{p.amount}</td>
                    <td>{p.payment_method}</td>
                    <td>{p.transaction_id}</td>
                    <td>{p.account_number}</td>
                    <td>{p.status}</td>
                    <td>{new Date(p.payment_date).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleApproveReject(p.payment_id, "approve")
                        }
                        className={styles.approveBtn}>
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(p.payment_id, "reject")
                        }
                        className={styles.rejectBtn}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPendingPayments;
