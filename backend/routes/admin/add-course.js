const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// POST /api/admin/add-course
router.post('/add-course', authenticateToken, async (req, res) => {
  const { course_id, department_id, level_term_id, title, credit } = req.body;

  // Validate input
  if (!course_id || !department_id || !level_term_id || !title || !credit) {
    return res.status(400).json({ message: 'All fields (course_id, department_id, level_term_id, title, credit) are required' });
  }

  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Get the active session from the database
    const activeSessionResult = await pool.query('SELECT session_name FROM sessions WHERE is_active = TRUE LIMIT 1');

    if (activeSessionResult.rowCount === 0) {
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = activeSessionResult.rows[0].session_name;

    // Check if course already exists for the active session
    const existing = await pool.query('SELECT 1 FROM course WHERE course_id = $1 AND session_name = $2', [course_id, activeSession]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ message: 'Course with this ID already exists in the active session' });
    }

    // Validate department
    const deptCheck = await pool.query('SELECT 1 FROM department WHERE department_id = $1', [department_id]);
    if (deptCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    // Validate level_term
    const ltCheck = await pool.query('SELECT 1 FROM level_term WHERE level_term_id = $1', [level_term_id]);
    if (ltCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid level_term_id' });
    }

    // Insert course along with session
    await pool.query(
      `INSERT INTO course (course_id, department_id, level_term_id, title, credit, session_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [course_id, department_id, level_term_id, title, credit, activeSession]
    );

    res.status(201).json({ message: 'Course added successfully' });

  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
