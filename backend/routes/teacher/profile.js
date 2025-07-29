// routes/teacher.js
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Get current teacher profile
router.get("/profile", authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    const result = await pool.query(
      `SELECT
        t.login_id AS "User_ID",
        t.name AS Name,
        d.department_id AS Department,
        t.email,
        t.phone_number AS Phone,
        t.session_name AS "Session" -- Added session
       FROM teacher t
       LEFT JOIN department d ON t.department_id = d.department_id
       WHERE t.login_id = $1`,
      [login_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'Profile incomplete',
        needsProfileSetup: true
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching teacher profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
