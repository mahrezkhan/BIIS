// routes/student.js
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/student/available-courses
router.get('/available-courses', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    // Step 1: Get the student's level_term_id and department_id
    const student = await pool.query(
      'SELECT level_term_id, department_id FROM student WHERE login_id = $1', 
      [login_id]
    );

    if (student.rowCount === 0) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const { level_term_id, department_id } = student.rows[0];

    // Step 2: Get the active session
    const sessionResult = await pool.query('SELECT * FROM get_active_session()'); 

    if (sessionResult.rowCount === 0) {
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Step 3: Fetch courses available for the student's level_term_id, department_id, and current session
    const courses = await pool.query(
      `SELECT course_id, title, credit
       FROM course
       WHERE level_term_id = $1 AND department_id = $2 AND session_name = $3`,
      [level_term_id, department_id, activeSession]
    );

    if (courses.rowCount === 0) {
      return res.status(400).json({ message: 'No courses available for this level/term, department, and session' });
    }

    res.status(200).json(courses.rows);
  } catch (err) {
    console.error('Error fetching available courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
