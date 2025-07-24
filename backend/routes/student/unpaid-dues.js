const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/student/unpaid-dues
router.get('/unpaid-dues', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;  // Get the student's login ID from the token

  try {
    // Step 1: Fetch the student's unpaid dues
    const unpaidDues = await pool.query(
      'SELECT * FROM dues WHERE login_id = $1 AND status = $2',
      [login_id, 'unpaid']
    );

    if (unpaidDues.rowCount === 0) {
      return res.status(404).json({ message: 'No unpaid dues found for this student' });
    }

    // Step 2: Return the unpaid dues to the student
    res.status(200).json({ unpaid_dues: unpaidDues.rows });

  } catch (err) {
    console.error("Error fetching unpaid dues:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
