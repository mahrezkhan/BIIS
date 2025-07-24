const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/admin/assign-teacher
router.post('/assign-teacher', authenticateToken, async (req, res) => {
  const { course_id, login_id } = req.body;

  if (!course_id || !login_id) {
    return res.status(400).json({ message: 'course_id and login_id are required' });
  }

  try {
    // 1. Get the current active session
    const sessionResult = await pool.query('SELECT * FROM get_active_session()'); 
    if (sessionResult.rowCount === 0) {
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name; // Get the active session name

    // 2. Check if the course belongs to the active session
    const courseCheck = await pool.query(
      'SELECT 1 FROM course WHERE course_id = $1 AND session_name = $2',
      [course_id, activeSession]
    );

    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Course does not belong to the current active session' });
    }

    // 3. Check if the teacher exists and is associated with the active session
    const teacherCheck = await pool.query(
      'SELECT 1 FROM teacher WHERE login_id = $1 AND session_name = $2',
      [login_id, activeSession]
    );

    if (teacherCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Teacher is not associated with the current active session' });
    }

    // 4. Check if the teacher is already assigned to the course
    const alreadyAssigned = await pool.query(
      'SELECT 1 FROM teacher_course WHERE course_id = $1 AND login_id = $2',
      [course_id, login_id]
    );

    if (alreadyAssigned.rowCount > 0) {
      return res.status(409).json({ message: 'Teacher is already assigned to this course' });
    }

    // 5. Insert the teacher-course relation
    await pool.query(
      'INSERT INTO teacher_course (course_id, login_id) VALUES ($1, $2)',
      [course_id, login_id]
    );

    res.status(201).json({ message: 'Teacher successfully assigned to course' });
  } catch (err) {
    console.error('Assign teacher error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
