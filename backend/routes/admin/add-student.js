const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// Add student basic data before approval
router.post('/add-student', authenticateToken, async (req, res) => {
  const { login_id, level_term_id, department_id, hall_id, advisor_id } = req.body;
  
  const client = await pool.connect();  // Get a client to start the transaction
  
  try {
    await client.query('BEGIN');  // Start the transaction

    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      await client.query('ROLLBACK');  // Rollback the transaction if not authorized
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // 1. Check if login_id exists and is a student
    const loginCheck = await client.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );
    if (loginCheck.rowCount === 0) {
      await client.query('ROLLBACK');  // Rollback if user does not exist
      return res.status(400).json({ message: 'Invalid login_id: user does not exist' });
    }
    if (loginCheck.rows[0].user_type !== 'student') {
      await client.query('ROLLBACK');  // Rollback if user is not a student
      return res.status(400).json({ message: 'login_id does not belong to a student' });
    }

    // 2. Validate level_term_id if provided
    if (level_term_id) {
      const ltCheck = await client.query(
        'SELECT 1 FROM level_term WHERE level_term_id = $1',
        [level_term_id]
      );
      if (ltCheck.rowCount === 0) {
        await client.query('ROLLBACK');  // Rollback if level_term_id is invalid
        return res.status(400).json({ message: 'Invalid level_term_id' });
      }
    }

    // 3. Validate department_id if provided
    if (department_id) {
      const deptCheck = await client.query(
        'SELECT 1 FROM department WHERE department_id = $1',
        [department_id]
      );
      if (deptCheck.rowCount === 0) {
        await client.query('ROLLBACK');  // Rollback if department_id is invalid
        return res.status(400).json({ message: 'Invalid department_id' });
      }
    }

    // 4. Validate hall_id if provided
    if (hall_id) {
      const hallCheck = await client.query(
        'SELECT 1 FROM hall WHERE hall_id = $1',
        [hall_id]
      );
      if (hallCheck.rowCount === 0) {
        await client.query('ROLLBACK');  // Rollback if hall_id is invalid
        return res.status(400).json({ message: 'Invalid hall_id' });
      }
    }

    // 5. Validate advisor_id if provided
    if (advisor_id) {
      const advisorCheck = await client.query(
        'SELECT 1 FROM login WHERE login_id = $1 AND user_type = $2',
        [advisor_id, 'teacher']
      );
      if (advisorCheck.rowCount === 0) {
        await client.query('ROLLBACK');  // Rollback if advisor_id is invalid
        return res.status(400).json({ message: 'Invalid advisor_id: not found or not a teacher' });
      }
    }

    // 6. Check if student already exists
    const existingStudent = await client.query(
      'SELECT 1 FROM student WHERE login_id = $1',
      [login_id]
    );
    if (existingStudent.rowCount > 0) {
      await client.query('ROLLBACK');  // Rollback if student already exists
      return res.status(400).json({ message: 'Student record already exists' });
    }

    // 7. Insert student (with nulls allowed for optional fields)
    await client.query(
      `INSERT INTO student (login_id, level_term_id, department_id, hall_id, advisor_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        login_id,
        level_term_id || null,
        department_id || null,
        hall_id || null,
        advisor_id || null
      ]
    );

    // 8. Approve the user
    await client.query(
      'UPDATE login SET status = $1 WHERE login_id = $2',
      ['approved', login_id]
    );

    await client.query('COMMIT');  // Commit the transaction if everything is successful

    res.status(200).json({ message: 'Student added successfully to student table, user approved' });

  } catch (err) {
    await client.query('ROLLBACK');  // Rollback if any error occurs
    console.error('Error adding student:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();  // Release the client to the pool
  }
});

module.exports = router;
