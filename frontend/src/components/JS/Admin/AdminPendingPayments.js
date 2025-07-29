import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

const AdminPendingPayments = () => {
  const [feeType, setFeeType] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const token = sessionStorage.getItem("token");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    setPayments([]);
    try {
      const res = await axios.get(`/admin/pending-payments?fee_type=${feeType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const key = `${feeType}_pending`;
      setPayments(res.data[key] || []);
    } catch (err) {
      setPayments([]);
      setError(
        err.response?.data?.message || "Failed to fetch pending payments."
      );
    } finally {
      setLoading(false);
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
    <div>
      <h2>View Pending Payments</h2>
      <form onSubmit={handleFetch} style={{ marginBottom: "1rem" }}>
        <label>Fee Type:&nbsp;</label>
        <select
          value={feeType}
          onChange={(e) => setFeeType(e.target.value)}
          required
        >
          <option value="">Select Fee Type</option>
          <option value="registration_fee">Registration Fee</option>
          <option value="dining_fee">Dining Fee</option>
          <option value="hall_fee">Hall Fee</option>
        </select>
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Fetch Pending Payments
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {actionMessage && <p style={{ color: "green" }}>{actionMessage}</p>}
      {!loading && payments.length > 0 && (
        <table border="1" cellPadding="8">
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
            {payments.map((p) => (
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
                    onClick={() => handleApproveReject(p.payment_id, "approve")}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveReject(p.payment_id, "reject")}
                    style={{ color: "red" }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && payments.length === 0 && !error && (
        <p>No pending payments found for the selected fee type.</p>
      )}
    </div>
  );
};

export default AdminPendingPayments;