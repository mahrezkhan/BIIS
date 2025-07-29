const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/student/enroll
router.post('/enroll', authenticateToken, async (req, res) => {
  const { selected_courses } = req.body;  // Array of selected course IDs
  const login_id = req.user.login_id;

  const client = await pool.connect();  // Get a database client for transaction

  try {
    await client.query('BEGIN'); // Start the transaction

    // Step 1: Get the student's level_term_id, department_id, and advisor_id
    const student = await client.query(
      'SELECT level_term_id, department_id, advisor_id FROM student WHERE login_id = $1', [login_id]
    );

    if (student.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if student not found
      return res.status(400).json({ message: 'Student not found' });
    }

    const { level_term_id, department_id, advisor_id } = student.rows[0];

    // Step 2: Check if the advisor is still a valid teacher (i.e., exists in the teacher table)
    const advisorCheck = await client.query(
      'SELECT 1 FROM teacher WHERE login_id = $1',
      [advisor_id]
    );

    if (advisorCheck.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if advisor is not valid
      return res.status(400).json({ message: 'Invalid or inactive advisor' });
    }

    // Step 3: Get the current active session
    const sessionResult = await client.query('SELECT * FROM get_active_session()');

    if (sessionResult.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if no active session found
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Check if there is already a pending enrollment request for the student and session
    const existingRequest = await client.query(
      `SELECT 1 
       FROM enrollment_requests 
       WHERE login_id = $1 
       AND status = 'pending'`,
      [login_id]
    );

    if (existingRequest.rowCount > 0) {
      await client.query('ROLLBACK'); // Rollback if there is already a pending request
      return res.status(400).json({ message: 'You already have a pending enrollment request for this session' });
    }

    // Step 4: Validate selected courses belong to the student's level_term, department, and current session
    for (const course_id of selected_courses) {
      const course = await client.query(
        `SELECT 1 
         FROM course 
         WHERE course_id = $1 
         AND level_term_id = $2 
         AND department_id = $3 
         AND session_name = $4`, 
        [course_id, level_term_id, department_id, activeSession]
      );

      if (course.rowCount === 0) {
        await client.query('ROLLBACK'); // Rollback if any course is invalid
        return res.status(400).json({ message: `Course ${course_id} is not available for your level/term, department, and the current session` });
      }
    }

    // Step 5: Insert the enrollment request into the enrollment_requests table with 'pending' status
    await client.query(
      'INSERT INTO enrollment_requests (login_id, selected_courses, request_date, status, advisor_id) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *',
      [login_id, selected_courses, 'pending', advisor_id]
    );

    await client.query('COMMIT'); // Commit the transaction if everything is successful
    res.status(200).json({ message: 'Enrollment request submitted for advisor approval' });

  } catch (err) {
    console.error('Error submitting enrollment request:', err);
    await client.query('ROLLBACK'); // Rollback the transaction in case of error
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;
