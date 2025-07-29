const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Admin route for responding to a request
router.post('/reply-request', authenticateToken, async (req, res) => {
  const { request_id, response_content } = req.body;
  const admin_login_id = req.user.login_id;

  const client = await pool.connect();  // Get a database client for transaction

  try {
    await client.query('BEGIN'); // Start the transaction

    // Step 1: Check if the request exists
    const request = await client.query(
      'SELECT * FROM requests WHERE request_id = $1 AND status = $2',
      [request_id, 'pending']
    );

    if (request.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if request is not found or already responded to
      return res.status(404).json({ message: 'Request not found or already responded to' });
    }

    // Step 2: Insert admin's response
    await client.query(
      'INSERT INTO responses (request_id, admin_login_id, response_content) VALUES ($1, $2, $3)',
      [request_id, admin_login_id, response_content]
    );

    // Step 3: Update the request status to 'responded'
    await client.query(
      'UPDATE requests SET status = $1 WHERE request_id = $2',
      ['responded', request_id]
    );

    await client.query('COMMIT'); // Commit the transaction

    res.status(200).json({ message: 'Response submitted successfully' });
  } catch (err) {
    console.error('Error responding to request:', err);
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
