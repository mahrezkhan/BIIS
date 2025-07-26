const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Student route to view their requests and responses
router.get('/view-requests', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    // Step 1: Get the student's requests
    const requests = await pool.query(
      'SELECT * FROM requests WHERE login_id = $1 ORDER BY request_date DESC',
      [login_id]
    );

    if (requests.rowCount === 0) {
      return res.status(404).json({ message: 'No requests found' });
    }

    // Step 2: Get responses for each request
    const requestsWithResponses = [];

    for (const request of requests.rows) {
      const responses = await pool.query(
        'SELECT * FROM responses WHERE request_id = $1',
        [request.request_id]
      );
      requestsWithResponses.push({
        ...request,
        responses: responses.rows
      });
    }

    res.status(200).json({ requests: requestsWithResponses });
  } catch (err) {
    console.error('Error fetching requests and responses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;