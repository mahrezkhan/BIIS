const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/student/view-level-term-for-grade
router.get("/view-level-term-for-grade", authenticateToken, async (req, res) => {
  const student_id = req.user.login_id;  // Get student login ID from the token

  try {
    // Step 1: Get all distinct level-term combinations that the student has attended
    const levelTermQuery = `
  SELECT DISTINCT lt.level_term_id, lt.level, lt.term
  FROM enrollment e
  JOIN course c ON e.course_id = c.course_id  -- Join with course table
  JOIN level_term lt ON c.level_term_id = lt.level_term_id  -- Join with level_term using level_term_id from course
  JOIN sessions s ON e.session_name = s.session_name  -- Join with sessions table to ensure result is published
  WHERE e.login_id = $1
    AND s.result_update = 'published'
  ORDER BY lt.level_term_id DESC
`;


    const levelTermResult = await pool.query(levelTermQuery, [student_id]);

    if (levelTermResult.rowCount === 0) {
      return res.status(404).json({ message: "No published level-term found for the student." });
    }

    // Step 2: Return the list of level-term combinations that have the result published
    res.status(200).json({
      level_terms: levelTermResult.rows
    });
  } catch (err) {
    console.error("Error fetching level-term:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
