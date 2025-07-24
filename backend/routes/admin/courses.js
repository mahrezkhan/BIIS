const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");
// GET /api/admin/courses
router.get('/courses', authenticateToken,async (req, res) => {
  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const result = await pool.query(`
      SELECT c.*, d.name AS department_name
      FROM course c
      LEFT JOIN department d ON c.department_id = d.department_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



 module.exports = router;