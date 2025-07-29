const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/db");
const authenticateToken = require("../middleware/auth");

// POST /signup
router.post('/signup', async (req, res) => {
  const { login_id, password, email, user_type } = req.body;

  // Validate required fields
  if (!login_id || !password || !email || !user_type) {
    return res.status(400).json({ message: 'All fields (login_id, password, email, user_type) are required' });
  }

  const validTypes = ['student', 'teacher', 'admin'];
  if (!validTypes.includes(user_type.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid user_type. Must be student, teacher, or admin.' });
  }

  const client = await pool.connect();  // Get a database client for transaction
  try {
    await client.query('BEGIN'); // Start the transaction

    // Check if the login_id already exists
    const check = await client.query("SELECT * FROM LOGIN WHERE login_id = $1", [login_id]);
    if (check.rows.length > 0) {
      if (check.rows[0].status === 'approved') {
        return res.status(400).json({ message: 'ID already signed up' });
      } else {
        return res.status(400).json({ message: 'Sign up request already in queue' });
      }
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into LOGIN table
    await client.query(
      "INSERT INTO LOGIN (login_id, user_type, password, email, status) VALUES ($1, $2, $3, $4, 'pending')",
      [login_id, user_type, hashedPassword, email]
    );

    await client.query('COMMIT'); // Commit the transaction
    res.status(200).json({ message: 'Signup submitted. Waiting for admin approval.' });

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of error
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

// POST /signin
router.post('/signin', async (req, res) => {
  const { user_type, login_id, password } = req.body;

  // Check if all required fields are provided
  if (!user_type || !login_id || !password) {
    return res.status(400).json({ message: 'user_type, login_id, and password are required' });
  }

  try {
    // Check if the user exists based on the provided user_type
    const result = await pool.query(
      "SELECT * FROM LOGIN WHERE login_id = $1 AND user_type = $2", 
      [login_id, user_type]
    );

    // If no matching user is found, return an error
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid ID or user type' });
    }

    const user = result.rows[0];

    // Check if the account is approved
    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Account not approved' });
    }

    // Compare the provided password with the hashed password in the database
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token if login is successful
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
