import React, { useState } from "react";
import axios from "../../../api/axiosInstance";
import styles from "../../css/form.module.css"; // Create this CSS file as per your design
import { useNavigate, useLocation } from "react-router-dom";
const AdminAddFee = () => {
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hallId, setHallId] = useState("");
  const [levelTermId, setLevelTermId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const [showModal, setShowModal] = useState(true); // Show/Hide approval modal
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(
        "/admin/add-fee",
        {
          fee_type: feeType,
          amount,
          due_date: dueDate,
          hall_id: hallId || undefined,
          level_term_id: levelTermId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Fee added successfully!");
      setAmount("");
      setDueDate("");
      setHallId("");
      setLevelTermId("");
      setFeeType("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add fee. Please try again."
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
        </nav>
      </aside>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modelh2}>Add Fee</h2>
            <form onSubmit={handleSubmit}>
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
              <label className={styles.modelh2}>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
              />
              <label className={styles.modelh2}>Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              <div>
                {/* Show Hall ID if needed */}
                {(feeType === "hall_fee" || feeType === "dining_fee") && (
                  <div>
                    <label className={styles.modelh2}>Hall ID:</label>
                    <input
                      type="text"
                      value={hallId}
                      onChange={(e) => setHallId(e.target.value)}
                      required={
                        feeType === "hall_fee" || feeType === "dining_fee"
                      }
                    />
                  </div>
                )}
                {/* Show Level Term ID if needed */}
                {(feeType === "hall_fee" || feeType === "registration_fee") && (
                  <div className={styles.modelh2}>
                    <label>Level Term ID:</label>
                    <input
                      type="text"
                      value={levelTermId}
                      onChange={(e) => setLevelTermId(e.target.value)}
                      required={
                        feeType === "hall_fee" || feeType === "registration_fee"
                      }
                    />
                  </div>
                )}
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
    </div>
  );
};

export default AdminAddFee;
