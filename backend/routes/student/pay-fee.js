const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/student/pay-fee
router.post("/pay-fee", authenticateToken, async (req, res) => {
  const { due_code, payment_method, transaction_id, amount, account_number } = req.body;
  const login_id = req.user.login_id;

  if (!due_code || !payment_method || !transaction_id || !amount || !account_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Step 1: Validate if the due code exists
    const dueCheck = await pool.query('SELECT * FROM dues WHERE due_code = $1 AND login_id = $2', [due_code, login_id]);
    if (dueCheck.rowCount === 0) {
      return res.status(400).json({ message: 'No due found for the given student and due code' });
    }

    const due = dueCheck.rows[0];

    // Step 2: Check if the due is already paid
    if (due.status === 'paid') {
      return res.status(400).json({ message: 'This fee has already been paid' });
    }

    // Step 3: Insert the payment details into the payments table (status pending until admin approval)
    await pool.query(
      `INSERT INTO payments (login_id, due_code, payment_method, transaction_id, amount, account_number, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [login_id, due_code, payment_method, transaction_id, amount, account_number, 'pending'] // status is pending until approved by admin
    );

    res.status(200).json({ message: 'Payment successfully submitted, awaiting admin approval' });

  } catch (err) {
    console.error("Error submitting payment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
