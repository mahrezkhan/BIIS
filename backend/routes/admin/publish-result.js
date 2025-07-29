const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// Admin route to publish result
router.post('/publish-result', authenticateToken, async (req, res) => {
  const { session_name } = req.body;

  if (!session_name) {
    return res.status(400).json({ message: 'Session name is required' });
  }

  try {
    // Ensure the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to publish results' });
    }

    // Step 1: Check if the session exists and is active
    const sessionCheck = await pool.query(
      'SELECT * FROM sessions WHERE session_name = $1',
      [session_name]
    );

    if (sessionCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Step 2: Trigger the function to check if all marks are entered
    await pool.query(
      'UPDATE sessions SET result_update = $1 WHERE session_name = $2',
      ['published', session_name]
    );

    res.status(200).json({ message: `Result published successfully for session ${session_name}` });

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
