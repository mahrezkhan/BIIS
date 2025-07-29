const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// GET /api/student/view-courses
router.get('/view-courses', authenticateToken, async (req, res) => {
  try {
    // Step 1: Ensure the user is a student
    if (req.user.user_type !== 'student') {
      return res.status(403).json({ message: 'You are not authorized to view courses' });
    }

    // Step 2: Fetch the student's current level_term_id from the student table
    const studentResult = await pool.query(
      `SELECT level_term_id 
       FROM student 
       WHERE login_id = $1`,
      [req.user.login_id]
    );

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const level_term_id = studentResult.rows[0].level_term_id;

    // Step 3: Fetch the courses for the student in the current level and term
    const coursesResult = await pool.query(
      `SELECT c.course_id, c.title, c.credit 
       FROM course c
       JOIN enrollment e ON c.course_id = e.course_id
       WHERE e.login_id = $1 AND c.level_term_id = $2`, 
      [req.user.login_id, level_term_id]
    );

    if (coursesResult.rowCount === 0) {
      return res.status(404).json({ message: 'No courses found for the selected level and term' });
    }

    res.status(200).json({ courses: coursesResult.rows });

  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
