const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// Add teacher with transaction handling
router.post('/add-teacher', authenticateToken, async (req, res) => {
  const { login_id, department_id, name, email, phone_number } = req.body;

  if (!login_id || !department_id) {
    return res.status(400).json({ message: 'login_id and department_id are required' });
  }

  const client = await pool.connect();  // Get client to start the transaction

  try {
    await client.query('BEGIN');  // Start the transaction

    // Check if the user is an admin
    if (req.user.user_type !== 'admin') {
      await client.query('ROLLBACK');  // Rollback if not an admin
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Step 1: Validate if login_id exists and belongs to a teacher
    const loginCheck = await client.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );
    if (loginCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if login_id doesn't exist
      return res.status(400).json({ message: 'Invalid login_id: user does not exist' });
    }
    if (loginCheck.rows[0].user_type !== 'teacher') {
      await client.query('ROLLBACK');  // Rollback if login_id doesn't belong to teacher
      return res.status(400).json({ message: 'login_id does not belong to a teacher' });
    }

    // Step 2: Validate department_id
    const deptCheck = await client.query(
      'SELECT 1 FROM department WHERE department_id = $1',
      [department_id]
    );
    if (deptCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if department_id is invalid
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    // Step 3: Check if teacher already exists
    const existing = await client.query(
      'SELECT 1 FROM teacher WHERE login_id = $1',
      [login_id]
    );
    if (existing.rowCount > 0) {
      await client.query('ROLLBACK');  // Rollback if teacher already exists
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    // Step 4: Insert teacher into the teacher table
    await client.query(
      `INSERT INTO teacher (login_id, department_id, name, email, phone_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        login_id,
        department_id,
        name || null,
        email || null,
        phone_number || null
      ]
    );

    // Step 5: Get the active session and update the teacher's session
    const activeSessionResult = await client.query('SELECT * FROM get_active_session()');

    if (activeSessionResult.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if no active session
      return res.status(400).json({ message: 'No active session found' });
    }

    const activeSessionName = activeSessionResult.rows[0].session_name;

    // Step 6: Update the teacher's session to the current active session
    await client.query(
      'UPDATE teacher SET session_name = $1 WHERE login_id = $2',
      [activeSessionName, login_id]
    );

    // Step 7: Approve the teacher in the login table
    await client.query(
      'UPDATE login SET status = $1 WHERE login_id = $2',
      ['approved', login_id]
    );

    await client.query('COMMIT');  // Commit the transaction if all steps succeed

    res.status(200).json({ message: 'Teacher added successfully to teacher table and session updated' });

  } catch (err) {
    await client.query('ROLLBACK');  // Rollback the transaction if any error occurs
    console.error('Error adding teacher:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
