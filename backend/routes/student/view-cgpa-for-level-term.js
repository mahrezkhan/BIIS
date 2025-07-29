const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/student/view-cgpa-for-level-term
router.get('/view-cgpa-for-level-term', authenticateToken, async (req, res) => {
  const { level_term_id } = req.query;  // Level and Term ID

  try {
    // Ensure the user is a student
    if (req.user.user_type !== 'student') {
      return res.status(403).json({ message: 'You are not authorized to view CGPA' });
    }

    // Step 1: Call the PL/pgSQL function to calculate CGPA
    const cgpaResult = await pool.query(
      `SELECT * FROM calculate_student_cgpa($1, $2)`,
      [req.user.login_id, level_term_id]
    );

    if (cgpaResult.rowCount === 0) {
      return res.status(404).json({ message: 'No CGPA data found for the student in this level and term' });
    }

    // Step 2: Return the course-wise CGPA and total CGPA
    res.status(200).json({
      courses: cgpaResult.rows.map(row => ({
        course_id: row.course_id,
        course_title: row.course_title,
        course_cgpa: row.course_cgpa
      })),
      total_cgpa: cgpaResult.rows[0].total_cgpa
    });

  } catch (err) {
    console.error("Error fetching CGPA:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
