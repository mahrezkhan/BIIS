const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require('../../middleware/auth');

// View pending users
router.get('/pending-students',authenticateToken, async (req, res) => {
  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='student' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending-teachers',authenticateToken, async (req, res) => {
  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='teacher' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;