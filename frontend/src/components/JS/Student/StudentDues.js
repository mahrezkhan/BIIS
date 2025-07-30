import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/Table.module.css";
import { useLocation } from "react-router-dom";

const StudentDues = () => {
  // Move all state declarations to the top
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDue, setSelectedDue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");

  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    fetchDues();
  }, [token]);

  const fetchDues = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/student/unpaid-dues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDues(res.data.unpaid_dues || []);
    } catch (err) {
      setDues([]);
      setError(err.response?.data?.message || "Failed to fetch unpaid dues.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSuccess("");

    if (!selectedDue) {
      setError("No due selected");
      return;
    }

    try {
      await axios.post(
        "/student/pay-fee",
        {
          due_code: selectedDue.due_code,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          amount,
          account_number: accountNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Payment submitted! Awaiting admin approval.");

      // Reset form and refresh data
      setTimeout(() => {
        setShowModal(false);
        setPaymentMethod("");
        setTransactionId("");
        setAmount("");
        setAccountNumber("");
        setSelectedDue(null);
        fetchDues();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit payment.");
    }
  };

  const done = (due) => {
    setSelectedDue(due);
    setAmount(due.amount);
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <h2>Unpaid Dues</h2>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>Due Code</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {dues.length === 0 ? (
              <tr>
                <td colSpan="6">No pending dues found.</td>
              </tr>
            ) : (
              dues.map((due) => (
                <tr key={due.due_code}>
                  <td>{due.due_code}</td>
                  <td>{due.fee_type}</td>
                  <td>{due.amount}</td>
                  <td>{new Date(due.due_date).toLocaleDateString()}</td>
                  <td>{due.status}</td>
                  <td>
                    <button className={styles.submitBtn} onClick={() => done(due)}>Pay Fee</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedDue && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modelh2}>
              Pay Fee for Due Code: {selectedDue.due_code}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.modelh2}>Payment Method:</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  placeholder="e.g. bKash, Nagad"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modelh2}>Transaction ID:</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modelh2}>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.modelh2}>Account Number:</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              <div className={styles.modalButtons}>
                <button className={styles.submitBtn} type="submit">Submit</button>
                <button className={styles.cancelBtn} type="button" onClick={() => setShowModal(false)}>
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

export default StudentDues;
