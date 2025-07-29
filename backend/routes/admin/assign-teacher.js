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

  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    // 1. Get the current active session
    const sessionResult = await client.query('SELECT * FROM get_active_session()'); 
    if (sessionResult.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if no active session found
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name; // Get the active session name

    // 2. Check if the course belongs to the active session
    const courseCheck = await client.query(
      'SELECT 1 FROM course WHERE course_id = $1 AND session_name = $2',
      [course_id, activeSession]
    );

    if (courseCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if the course does not belong to the active session
      return res.status(400).json({ message: 'Course does not belong to the current active session' });
    }

    // 3. Check if the teacher exists and is associated with the active session
    const teacherCheck = await client.query(
      'SELECT 1 FROM teacher WHERE login_id = $1 AND session_name = $2',
      [login_id, activeSession]
    );

    if (teacherCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if the teacher is not associated with the active session
      return res.status(400).json({ message: 'Teacher is not associated with the current active session' });
    }

    // 4. Check if the teacher is already assigned to the course
    const alreadyAssigned = await client.query(
      'SELECT 1 FROM teacher_course WHERE course_id = $1 AND login_id = $2',
      [course_id, login_id]
    );

    if (alreadyAssigned.rowCount > 0) {
      await client.query('ROLLBACK');  // Rollback if the teacher is already assigned to the course
      return res.status(409).json({ message: 'Teacher is already assigned to this course' });
    }

    // 5. Insert the teacher-course relation
    await client.query(
      'INSERT INTO teacher_course (course_id, login_id) VALUES ($1, $2)',
      [course_id, login_id]
    );

    // Commit the transaction
    await client.query('COMMIT');

    res.status(201).json({ message: 'Teacher successfully assigned to course' });

  } catch (err) {
    // If there's an error, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Assign teacher error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

module.exports = router;
