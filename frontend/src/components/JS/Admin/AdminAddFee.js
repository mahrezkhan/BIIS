import React, { useState } from "react";
import axios from "../../../api/axiosInstance";

const AdminAddFee = () => {
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hallId, setHallId] = useState("");
  const [levelTermId, setLevelTermId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

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
      setMessage("Fee added successfully!");
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
    <div>
      <h2>Add Fee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fee Type:</label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            required
          >
            <option value="">Select Fee Type</option>
            <option value="hall_fee">Hall Fee</option>
            <option value="dining_fee">Dining Fee</option>
            <option value="registration_fee">Registration Fee</option>
          </select>
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
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        {/* Show Hall ID if needed */}
        {(feeType === "hall_fee" || feeType === "dining_fee") && (
          <div>
            <label>Hall ID:</label>
            <input
              type="text"
              value={hallId}
              onChange={(e) => setHallId(e.target.value)}
              required={feeType === "hall_fee" || feeType === "dining_fee"}
            />
          </div>
        )}
        {/* Show Level Term ID if needed */}
        {(feeType === "hall_fee" || feeType === "registration_fee") && (
          <div>
            <label>Level Term ID:</label>
            <input
              type="text"
              value={levelTermId}
              onChange={(e) => setLevelTermId(e.target.value)}
              required={feeType === "hall_fee" || feeType === "registration_fee"}
            />
          </div>
        )}
        <button type="submit">Add Fee</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminAddFee;