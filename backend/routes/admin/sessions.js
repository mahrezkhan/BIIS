const express = require('express');
const router = express.Router();
const pool = require('../../db/db'); // Make sure the path to db is correct
const authenticateToken = require("../../middleware/auth");

// Route to get all session names from the sessions table
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    // Fetch all session names from the sessions table
    const result = await pool.query('SELECT session_name FROM sessions');

    // Check if any session names were found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No sessions found' });
    }

    // Send the session names as the response
    res.status(200).json({ sessions: result.rows });
  } catch (err) {
    console.error('Error fetching session names:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
