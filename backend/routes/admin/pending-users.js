const express = require('express');
const router = express.Router();
const pool = require('../../db/db');

// View pending users
router.get('/pending-students', async (req, res) => {
  try {
    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='student' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending-teachers', async (req, res) => {
  try {
    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='teacher' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;