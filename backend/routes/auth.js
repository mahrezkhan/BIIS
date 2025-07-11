const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');

router.post('/signup', async (req, res) => {
  const { login_id, password, email, user_type } = req.body;

  // Validate required fields
if (!login_id || !password || !email || !user_type) {
  return res.status(400).json({ message: 'All fields (login_id, password, email, user_type) are required' });
}
// Validate required fields
if (!login_id || !password || !email || !user_type) {
  return res.status(400).json({ message: 'All fields (login_id, password, email, user_type) are required' });
}

//  restrict to known user types
const validTypes = ['student', 'teacher', 'admin'];
if (!validTypes.includes(user_type.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid user_type. Must be student, teacher, or admin.' });
}

if (!validTypes.includes(user_type.toLowerCase())) {
  return res.status(400).json({ message: 'Invalid user_type. Must be student, teacher, or admin.' });
}


  try {
    const check = await pool.query("SELECT * FROM LOGIN WHERE login_id = $1", [login_id]);
    if (check.rows.length > 0) {
      if(check.rows[0].status==='approved') return res.status(400).json({ message: 'ID already signed up' });
      else return res.status(400).json({ message: 'Sign up request already in queue' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO LOGIN (login_id, user_type, password, email, status) VALUES ($1, $2, $3, $4, 'pending')",
      [login_id, user_type, hashedPassword, email]
    );

    res.status(200).json({ message: 'Signup submitted. Waiting for admin approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signin', async (req, res) => {
  const { login_id, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM LOGIN WHERE login_id = $1", [login_id]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid ID' });

    const user = result.rows[0];
    if (user.status !== 'approved') return res.status(403).json({ message: 'Account not approved' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { login_id: user.login_id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
