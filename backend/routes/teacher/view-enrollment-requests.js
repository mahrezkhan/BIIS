// routes/teacher.js
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/teacher/view-enrollment-requests
router.get('/view-enrollment-requests', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;  // Logged-in teacher's login_id

  try {
    // Fetch the enrollment requests for students assigned to this advisor
    const result = await pool.query(
      `SELECT * FROM enrollment_requests 
       WHERE advisor_id = $1 AND status = 'pending'`,
      [login_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No pending enrollment requests found' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching enrollment requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;