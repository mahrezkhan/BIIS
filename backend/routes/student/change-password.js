const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../../middleware/auth");
// POST /api/student/change-password
router.post("/change-password", authenticateToken, async (req, res) => {
  const { email, old_password, new_password } = req.body;
  const login_id = req.user.login_id; // Get login_id from the token

  // Validate required fields
  if (!email || !old_password || !new_password) {
    return res.status(400).json({ message: "Email, old password, and new password are required" });
  }

  const client = await pool.connect();  // Get a database client for transaction
  try {
    await client.query('BEGIN'); // Start the transaction

    // Step 1: Check if the user with the provided email exists
    const userCheck = await client.query(
      'SELECT * FROM login WHERE email = $1 AND login_id = $2',
      [email, login_id]
    );

    if (userCheck.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback the transaction if user not found
      return res.status(400).json({ message: "Email does not match with the logged-in user" });
    }

    const user = userCheck.rows[0];

    // Step 2: Compare the provided old password with the stored hashed password
    const validOldPassword = await bcrypt.compare(old_password, user.password);
    if (!validOldPassword) {
      await client.query('ROLLBACK'); // Rollback the transaction if old password doesn't match
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Step 3: Hash the new password before saving it
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Step 4: Update the password in the database
    await client.query(
      'UPDATE login SET password = $1 WHERE login_id = $2',
      [hashedNewPassword, login_id]
    );

    await client.query('COMMIT'); // Commit the transaction
    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Error changing password:", err);
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;