
// routes/student.js
const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authenticateToken = require("../middleware/auth");
// POST /api/student/enroll
router.post('/enroll', authenticateStudent, async (req, res) => {
  const { selected_courses } = req.body;  // Array of selected course IDs
  const login_id = req.user.login_id;

  try {
    // Get the student's level_term_id, department_id, and advisor_id
    const student = await pool.query(
      'SELECT level_term_id, department_id, advisor_id FROM student WHERE login_id = $1', [login_id]
    );

    if (student.rowCount === 0) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const { level_term_id, department_id, advisor_id } = student.rows[0];

    // Validate selected courses belong to the student's level_term and department
    for (const course_id of selected_courses) {
      const course = await pool.query(
        'SELECT 1 FROM course WHERE course_id = $1 AND level_term_id = $2 AND department_id = $3',
        [course_id, level_term_id, department_id]
      );

      if (course.rowCount === 0) {
        return res.status(400).json({ message: `Course ${course_id} is not available for your level/term and department` });
      }
    }

    // Insert the enrollment request into the enrollment_requests table with 'pending' status
    await pool.query(
      'INSERT INTO enrollment_requests (login_id, selected_courses, request_date, status, advisor_id) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *',
      [login_id, selected_courses, 'pending', advisor_id]
    );

    res.status(200).json({ message: 'Enrollment request submitted for advisor approval' });
  } catch (err) {
    console.error('Error submitting enrollment request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
