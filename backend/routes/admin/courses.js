const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");
// GET /api/admin/courses
router.get('/courses', authenticateToken,async (req, res) => {
  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const result = await pool.query(`
      SELECT c.*, d.name AS department_name
      FROM course c
      LEFT JOIN department d ON c.department_id = d.department_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/admin/assign-teacher
router.post('/assign-teacher', async (req, res) => {
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