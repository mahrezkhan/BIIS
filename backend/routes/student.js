// routes/student.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const authenticateToken = require('../middleware/auth');

// Get current student profile
router.get('/me', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    const result = await pool.query(
      `SELECT 
         s.login_id, s.level_term_id, s.department_id, d.name AS department_name,
         s.hall_id, h.hall_name,
         s.advisor_id, t.name AS advisor_name,
         s.name, s.birth_registration_no, s.birth_date, s.nid,
         s.bank_account_number, s.email, s.district, s.upazilla,
         s.additional_address, s.contact_person_name, s.contact_person_address, s.mobile_number
       FROM student s
       LEFT JOIN department d ON s.department_id = d.department_id
       LEFT JOIN hall h ON s.hall_id = h.hall_id
       LEFT JOIN teacher t ON s.advisor_id = t.login_id
       WHERE s.login_id = $1`,
      [login_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update current student profile
router.put('/me', authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;
  const {
    name,
    email,
    phone_number,
    district,
    upazilla,
    additional_address,
    contact_person_name,
    contact_person_address,
    mobile_number
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE STUDENT
       SET name = $1, email = $2, phone_number = $3,
           district = $4, upazilla = $5, additional_address = $6,
           contact_person_name = $7, contact_person_address = $8,
           mobile_number = $9
       WHERE login_id = $10
       RETURNING *`,
      [name, email, phone_number, district, upazilla, additional_address,
       contact_person_name, contact_person_address, mobile_number, login_id]
    );

    res.json({ message: 'Profile updated', student: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
