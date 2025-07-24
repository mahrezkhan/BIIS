
const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");


// approve or reject
router.post('/verify',authenticateToken, async (req, res) => {
    console.log('Verify route hit'); 
  const { login_id, action } = req.body;
  

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // First, get user_type
    const userCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_type = userCheck.rows[0].user_type;

    // If student and action is approve, check if student table has a row
    if (user_type === 'student' && action === 'approve') {
      const studentCheck = await pool.query(
        'SELECT 1 FROM student WHERE login_id = $1',
        [login_id]
      );

      if (studentCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Student academic details not added. Cannot approve.' });
      }
    }

    // If teacher and action is approve, check if student table has a row
    if (user_type === 'teacher' && action === 'approve') {
      const studentCheck = await pool.query(
        'SELECT 1 FROM teacher WHERE login_id = $1',
        [login_id]
      );

      if (studentCheck.rowCount === 0) {
        return res.status(400).json({ message: 'teacher academic details not added. Cannot approve.' });
      }
    }

 if (action === 'reject') {
  // Get the user_type first
  const result = await pool.query(
    'SELECT user_type FROM login WHERE login_id = $1',
    [login_id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found in login table' });
  }

  const user_type = result.rows[0].user_type;

  // Remove from appropriate table
  if (user_type === 'student') {
    await pool.query('DELETE FROM student WHERE login_id = $1', [login_id]);
  } else if (user_type === 'teacher') {
    await pool.query('DELETE FROM teacher WHERE login_id = $1', [login_id]);
  }

  // Now remove from login
  await pool.query('DELETE FROM login WHERE login_id = $1', [login_id]);

  return res.status(200).json({ message: 'User rejected and all records deleted.' });
}


    // Approve the user
    await pool.query(
      'UPDATE login SET status = $1 WHERE login_id = $2',
      ['approved', login_id]
    );

    res.status(200).json({ message: 'User approved successfully.' });

  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;