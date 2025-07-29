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

  const client = await pool.connect(); // Get a client to execute the transaction

  try {
    // Ensure the user is an admin
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to publish results' });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Step 1: Check if the session exists and is active
    const sessionCheck = await client.query(
      'SELECT * FROM sessions WHERE session_name = $1',
      [session_name]
    );

    if (sessionCheck.rowCount === 0) {
      // Rollback if session is not found
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Session not found' });
    }

    // Step 2: Trigger the function to check if all marks are entered
    // Assuming you have a trigger in place to validate marks, this will automatically throw an error if marks are missing
    await client.query(
      'UPDATE sessions SET result_update = $1 WHERE session_name = $2',
      ['published', session_name]
    );

    // If no errors, commit the transaction
    await client.query('COMMIT');
    
    res.status(200).json({ message: `Result published successfully for session ${session_name}` });

  } catch (err) {
    // If an error occurs, rollback the transaction
    await client.query('ROLLBACK');

    // Check if the error is a PostgreSQL exception (raised by the trigger)
    if (err.code === 'P0001') {
      // If it's the custom exception raised by the trigger, show the message
      res.status(400).json({ message: err.message });
    } else {
      // Handle other errors (e.g., database connection issues)
      console.error('Error occurred during result publishing:', err);
      res.status(500).json({ message: 'Server error' });
    }

  } finally {
    // Release the client back to the pool
    client.release();
  }
});

module.exports = router;
