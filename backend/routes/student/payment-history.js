const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/student/payment-history
router.get('/payment-history', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;  // Get the student's login ID from the token

  const client = await pool.connect();  // Get a database client for transaction
  try {
    await client.query('BEGIN');  // Start the transaction

    // Step 1: Fetch all payments for the student (pending, approved, rejected)
    const paymentHistory = await client.query(
      `SELECT 
        p.due_code, 
        p.payment_method, 
        p.transaction_id, 
        p.amount, 
        p.status AS payment_status, 
        p.payment_date
      FROM payments p
      WHERE p.login_id = $1`,
      [login_id]
    );

    if (paymentHistory.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if no payments are found
      return res.status(404).json({ message: 'No payment history found for this student' });
    }

    // Step 2: Return the payment history
    await client.query('COMMIT');  // Commit the transaction
    res.status(200).json({ payment_history: paymentHistory.rows });

  } catch (err) {
    console.error('Error fetching payment history:', err);
    await client.query('ROLLBACK');  // Rollback the transaction in case of an error
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
