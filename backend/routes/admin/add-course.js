
const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");
// POST /api/admin/add-course
router.post('/add-course', authenticateToken,async (req, res) => {
  console.log("Request Body:", req.body);  // Log the incoming request body to check
  const { course_id, department_id, level_term_id, title, credit } = req.body;
  console.log("Received course_id:", course_id);  // Check if this prints properly
  // Validate input
  if (!course_id || !department_id || !level_term_id || !title || !credit) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Check if course already exists
    const existing = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ message: 'Course with this ID already exists' });
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

    // Insert course
    await pool.query(
      `INSERT INTO course (course_id, department_id, level_term_id, title, credit)
       VALUES ($1, $2, $3, $4, $5)`,
      [course_id, department_id, level_term_id, title, credit]
    );

    res.status(201).json({ message: 'Course added successfully' });

  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;