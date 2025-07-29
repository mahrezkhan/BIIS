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

  const client = await pool.connect();  // Get a client to start the transaction

  try {
    await client.query('BEGIN');  // Start transaction

    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      await client.query('ROLLBACK');  // Rollback the transaction if not authorized
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Get the active session from the database
    const activeSessionResult = await client.query('SELECT session_name FROM sessions WHERE is_active = TRUE LIMIT 1');

    if (activeSessionResult.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if no active session is found
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = activeSessionResult.rows[0].session_name;

    // Check if course already exists for the active session
    const existing = await client.query('SELECT 1 FROM course WHERE course_id = $1 AND session_name = $2', [course_id, activeSession]);
    if (existing.rowCount > 0) {
      await client.query('ROLLBACK');  // Rollback if course already exists
      return res.status(400).json({ message: 'Course with this ID already exists in the active session' });
    }

    // Validate department
    const deptCheck = await client.query('SELECT 1 FROM department WHERE department_id = $1', [department_id]);
    if (deptCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if department is invalid
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    // Validate level_term
    const ltCheck = await client.query('SELECT 1 FROM level_term WHERE level_term_id = $1', [level_term_id]);
    if (ltCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if level_term is invalid
      return res.status(400).json({ message: 'Invalid level_term_id' });
    }

    // Insert course along with session
    await client.query(
      `INSERT INTO course (course_id, department_id, level_term_id, title, credit, session_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [course_id, department_id, level_term_id, title, credit, activeSession]
    );

    await client.query('COMMIT');  // Commit the transaction if everything is successful
    res.status(201).json({ message: 'Course added successfully' });

  } catch (err) {
    await client.query('ROLLBACK');  // Rollback if any error occurs
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();  // Release the client to the pool
  }
});

module.exports = router;
