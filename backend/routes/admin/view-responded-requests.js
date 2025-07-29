const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/admin/view-responded-requests
router.get('/view-responded-requests', authenticateToken, async (req, res) => {
  // Ensure the user is an admin
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to perform this action' });
  }

  try {
    // Step 1: Fetch all responded requests for the admin
    const result = await pool.query(
      'SELECT r.*,resp.response_content FROM requests r LEFT JOIN responses resp ON r.request_id=resp.request_id  WHERE r.status = $1 ORDER BY r.request_date DESC',
      ['responded']
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No responded requests found' });
    }

    // Step 2: Return the list of responded requests
    res.status(200).json({
      message: "Responded requests fetched successfully",
      requests: result.rows
    });

  } catch (err) {
    console.error("Error fetching responded requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;