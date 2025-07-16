const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");
//add teacher 
router.post('/add-teacher', authenticateToken,async (req, res) => {
  const { login_id, department_id, name, email, phone_number } = req.body;

  if (!login_id || !department_id) {
    return res.status(400).json({ message: 'login_id and department_id are required' });
  }

  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const loginCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );

    if (loginCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid login_id: user does not exist' });
    }
    if (loginCheck.rows[0].user_type !== 'teacher') {
      return res.status(400).json({ message: 'login_id does not belong to a teacher' });
    }

    const deptCheck = await pool.query(
      'SELECT 1 FROM department WHERE department_id = $1',
      [department_id]
    );
    if (deptCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    const existing = await pool.query(
      'SELECT 1 FROM teacher WHERE login_id = $1',
      [login_id]
    );
    if (existing.rowCount > 0) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    await pool.query(
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

    res.status(200).json({ message: 'Teacher added successfully to teacher table' });

  } catch (err) {
    console.error('Error adding teacher:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;