const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require('../../middleware/auth');

// POST /api/admin/drop-course
router.post('/drop-course', authenticateToken, async (req, res) => {
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  const client = await pool.connect(); // Get a database client for transaction

  try {
    await client.query('BEGIN'); // Start the transaction

    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      await client.query('ROLLBACK'); // Rollback if not an admin
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Check if the course exists
    const courseCheck = await client.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (courseCheck.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if course not found
      return res.status(400).json({ message: 'Course not found' });
    }

    // Step 1: Remove the teacher-course relationship
    await client.query('DELETE FROM teacher_course WHERE course_id = $1', [course_id]);

    // Step 2: Remove the student enrollment
    await client.query('DELETE FROM enrollment WHERE course_id = $1', [course_id]);

    // Step 3: Remove the course itself
    await client.query('DELETE FROM course WHERE course_id = $1', [course_id]);

    await client.query('COMMIT'); // Commit the transaction

    res.status(200).json({ message: 'Course dropped successfully' });
  } catch (err) {
    console.error('Error dropping course:', err);
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;
