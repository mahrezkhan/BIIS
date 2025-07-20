// routes/admin/assign-teacher.js

const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/admin/assign-teacher
router.post('/assign-teacher',authenticateToken, async (req, res) => {
  const { course_id, login_id } = req.body;

  if (!course_id || !login_id) {
    return res.status(400).json({ message: 'course_id and login_id are required' });
  }

  try {
    // Check if course exists
    const courseCheck = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid course_id' });
    }

    // Check if teacher exists
    const teacherCheck = await pool.query('SELECT 1 FROM teacher WHERE login_id = $1', [login_id]);
    if (teacherCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid teacher login_id' });
    }

    // Check if already assigned
    const alreadyAssigned = await pool.query(
      'SELECT 1 FROM teacher_course WHERE course_id = $1 AND login_id = $2',
      [course_id, login_id]
    );
    if (alreadyAssigned.rowCount > 0) {
      return res.status(409).json({ message: 'Teacher is already assigned to this course' });
    }

    // Insert teacher-course relation
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
