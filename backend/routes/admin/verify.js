
const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// routes/admin.js (for the approve/reject logic)
router.post('/verify', authenticateToken, async (req, res) => {
  console.log('Verify route hit');
  const { login_id, action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // First, get user_type
    const userCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_type = userCheck.rows[0].user_type;

    if (action === 'approve') {
      // Update the user status to approved (trigger will handle the rest)
      await pool.query(
        'UPDATE login SET status = $1 WHERE login_id = $2',
        ['approved', login_id]
      );
      return res.status(200).json({ message: 'User approved successfully.' });
    }

    if (action === 'reject') {
      // Remove user from appropriate table and login table
      if (user_type === 'student') {
        await pool.query('DELETE FROM student WHERE login_id = $1', [login_id]);
      } else if (user_type === 'teacher') {
        await pool.query('DELETE FROM teacher WHERE login_id = $1', [login_id]);
      }

      // Now remove from login table
      await pool.query('DELETE FROM login WHERE login_id = $1', [login_id]);

      return res.status(200).json({ message: 'User rejected and all records deleted.' });
    }
  } catch (err) {
    // Check if the error is a PostgreSQL exception (raised by the trigger)
    if (err.code === 'P0001') {
      // If it's the custom exception raised by the trigger, show the message
      res.status(400).json({ message: err.message });
    } else {
      // Handle other errors (e.g., database connection issues)
      res.status(500).json({ message: 'Server error' });
    }
  }
});
module.exports = router;