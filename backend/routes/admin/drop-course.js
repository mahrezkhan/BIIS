const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require('../../middleware/auth');
// POST /api/admin/drop-course
router.post('/drop-course',authenticateToken, async (req, res) => {
  const { course_id } = req.body;

  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Check if the course exists
    const courseCheck = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Step 1: Remove the teacher-course relationship
    await pool.query('DELETE FROM teacher_course WHERE course_id = $1', [course_id]);

    // Step 2: Remove the student enrollment
    await pool.query('DELETE FROM enrollment WHERE course_id = $1', [course_id]);

    // Step 3: Remove the course itself
    await pool.query('DELETE FROM course WHERE course_id = $1', [course_id]);

    res.status(200).json({ message: 'Course dropped successfully' });
  } catch (err) {
    console.error('Error dropping course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;