const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/admin/view-pending-requests
router.get('/view-pending-requests', authenticateToken, async (req, res) => {
  // Ensure the user is an admin
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }

  try {
    // Step 1: Fetch all pending requests for the admin
    const result = await pool.query(
      'SELECT * FROM requests WHERE status = $1 ORDER BY request_date DESC',
      ['pending']
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No pending requests found' });
    }

    // Step 2: Return the list of pending requests
    res.status(200).json({
      message: "Pending requests fetched successfully",
      requests: result.rows
    });

  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;