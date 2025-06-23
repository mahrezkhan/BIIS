const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// View pending users
router.get('/pending-users', async (req, res) => {
  try {
    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending'");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve / Reject
router.post('/verify', async (req, res) => {
  const { login_id, action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    await pool.query(
      "UPDATE LOGIN SET status = $1 WHERE login_id = $2",
      [action === 'approve' ? 'approved' : 'rejected', login_id]
    );

    res.status(200).json({ message: `User ${action}d successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
