const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/admin/pending-payments
router.get('/pending-payments', authenticateToken, async (req, res) => {
    console.log("hi");
  const { fee_type } = req.query; // Get the fee type from the query parameters

  try {
    // Ensure the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Validate fee_type
    if (!fee_type) {
      return res.status(400).json({ message: 'Fee type is required' });
    }

    // Step 1: Determine the filter query based on fee_type
    let query = '';
    let queryParams = [];

    if (fee_type === 'registration_fee') {
      query = `
        SELECT * FROM payments 
        WHERE  substr(due_code,1,2) = 'rf' AND status = 'pending'
      `;
    } else if (fee_type === 'dining_fee') {
      query = `
        SELECT * FROM payments 
        WHERE  substr(due_code,1,2) = 'df' AND status = 'pending'
      `;
    } else if (fee_type === 'hall_fee') {
      query = `
        SELECT * FROM payments 
        WHERE  substr(due_code,1,2) = 'hf' AND status = 'pending'
      `;
    } else {
      return res.status(400).json({ message: 'Invalid fee type specified' });
    }

    // Step 2: Fetch pending payments based on the specified fee type
    const pendingPayments = await pool.query(query, queryParams);

    // Step 3: Return the list of pending payments
    if (pendingPayments.rowCount === 0) {
      return res.status(404).json({ message: `No pending ${fee_type} payments found` });
    }

    res.status(200).json({ [`${fee_type}_pending`]: pendingPayments.rows });

  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
