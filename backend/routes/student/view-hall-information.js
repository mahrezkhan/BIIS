const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require('../../middleware/auth');

// GET /api/student/view-hall-information
router.get('/view-hall-information', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;  // Get the student's login_id from the token

  try {
    // Step 1: Fetch the student's hall information from the database
    const hallInfo = await pool.query(
      `SELECT s.hall_id, h.hall_name, h.superviser_name, h.phone_number, h.email
       FROM student s
       JOIN hall h ON s.hall_id = h.hall_id
       WHERE s.login_id = $1`,
      [login_id]
    );

    // Step 2: If no hall information is found, return an error
    if (hallInfo.rowCount === 0) {
      return res.status(404).json({ message: 'Hall information not found for this student' });
    }

    // Step 3: Return the hall information
    res.status(200).json({
      hall_id: hallInfo.rows[0].hall_id,
      hall_name: hallInfo.rows[0].hall_name,
      superviser_name: hallInfo.rows[0].superviser_name,
      phone_number: hallInfo.rows[0].phone_number,
      email: hallInfo.rows[0].email,
    });

  } catch (err) {
    console.error('Error fetching hall information:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
