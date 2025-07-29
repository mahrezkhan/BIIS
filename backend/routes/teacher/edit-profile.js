const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Update current teacher profile
router.put("/edit-profile", authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;
  const { name, email, phone_number } = req.body;

  const client = await pool.connect();  // Get a database client for transaction
  try {
    await client.query('BEGIN'); // Start the transaction

    // Update query for teacher's profile with only allowed fields
    const result = await client.query(
      `UPDATE teacher
       SET name = $1, email = $2, phone_number = $3
       WHERE login_id = $4
       RETURNING *`,
      [name, email, phone_number, login_id]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK'); // Rollback if no teacher found
      return res.status(404).json({ message: "Teacher not found" });
    }

    await client.query('COMMIT'); // Commit the transaction
    res.json({ message: "Profile updated successfully", teacher: result.rows[0] });

  } catch (err) {
    console.error(err);
    await client.query('ROLLBACK'); // Rollback the transaction in case of error
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
