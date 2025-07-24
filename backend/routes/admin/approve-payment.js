const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/admin/approve-payment
router.post("/approve-payment", authenticateToken, async (req, res) => {
  const { payment_id, approval_status } = req.body;  // approval_status could be 'approve' or 'reject'
  const admin_id = req.user.login_id;  // Admin ID

  if (!payment_id || !approval_status) {
    return res.status(400).json({ message: "Payment ID and approval status are required" });
  }

  try {
    // Ensure the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Step 1: Validate if the payment exists
    const paymentCheck = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [payment_id]);
    if (paymentCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Payment not found' });
    }

    const payment = paymentCheck.rows[0];
    
    // Step 2: Process approval or rejection
    if (approval_status === 'approve') {
      // If the payment is approved, update the dues table and set status to 'paid'
      const dueCheck = await pool.query('SELECT * FROM dues WHERE due_code = $1 AND login_id = $2', [payment.due_code, payment.login_id]);

      if (dueCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Due not found for the given student and due code' });
      }

      const due = dueCheck.rows[0];

      if (payment.amount >= due.amount) {
        // Full payment
        await pool.query(
          'UPDATE dues SET status = $1, paid_date = CURRENT_DATE, amount = $2 WHERE due_code = $3 AND login_id = $4',
          ['paid', 0, payment.due_code, payment.login_id]
        );
      } else {
        // Partial payment
        await pool.query(
          'UPDATE dues SET amount = $1 WHERE due_code = $2 AND login_id = $3',
          [due.amount - payment.amount, payment.due_code, payment.login_id]
        );
      }

      // Update payment status to 'approved'
      await pool.query(
        'UPDATE payments SET status = $1 WHERE payment_id = $2',
        ['approved', payment_id]
      );

      res.status(200).json({ message: 'Payment approved and dues updated' });
    } else if (approval_status === 'reject') {
      // If rejected, update payment status to 'rejected'
      await pool.query(
        'UPDATE payments SET status = $1 WHERE payment_id = $2',
        ['rejected', payment_id]
      );

      res.status(200).json({ message: 'Payment rejected' });
    } else {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

  } catch (err) {
    console.error("Error approving payment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
