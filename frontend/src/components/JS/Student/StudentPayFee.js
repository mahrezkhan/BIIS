import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

const StudentPayFee = ({ due, onSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(due.amount);
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post(
        "/student/pay-fee",
        {
          due_code: due.due_code,
          payment_method: paymentMethod,
          transaction_id: transactionId,
          amount,
          account_number: accountNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Payment submitted! Awaiting admin approval.");
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to submit payment."
      );
    }
  };

  return (
    <div>
      <h3>Pay Fee for Due Code: {due.due_code}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment Method:</label>
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            placeholder="e.g. bKash, Nagad"
          />
        </div>
        <div>
          <label>Transaction ID:</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />
        </div>
        <div>
          <label>Account Number:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Payment</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default StudentPayFee;