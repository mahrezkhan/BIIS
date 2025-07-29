const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/student/create-request
router.post('/create-request', authenticateToken, async (req, res) => {
  const { request_type, request_content } = req.body;
  const login_id = req.user.login_id;

  // Validate input
  if (!request_type || !request_content) {
    return res.status(400).json({ message: "Request type and content are required." });
  }

  const client = await pool.connect();  // Get a database client for transaction

  try {
    await client.query('BEGIN');  // Start the transaction

    // Step 1: Insert the student's request into the database
    const result = await client.query(
      `INSERT INTO requests (login_id, request_type, request_content, request_date, status) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'pending') RETURNING *`,
      [login_id, request_type, request_content]
    );

    // Step 2: Send success message
    await client.query('COMMIT');  // Commit the transaction
    res.status(201).json({
      message: "Request submitted successfully. Admin will respond to it shortly.",
      request: result.rows[0]
    });

  } catch (err) {
    console.error("Error creating request:", err);
    await client.query('ROLLBACK');  // Rollback the transaction if there's an error
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
