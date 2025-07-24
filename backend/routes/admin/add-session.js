const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

router.post("/add-session", authenticateToken, async (req, res) => {
  const { session_name } = req.body;  // session_name should be provided

  if (!session_name) {
    return res.status(400).json({ message: "session_name is required" });
  }

  try {
    const currentDate = new Date();  // Get current date for start_date and end_date

    // Step 1: Get the session name of the current active session
    const activeSessionResult =  await pool.query('SELECT * FROM get_active_session()'); 

    if (activeSessionResult.rowCount === 0) {
      return res.status(400).json({ message: "No active session found" });
    }

    const currentSessionName = activeSessionResult.rows[0].session_name;

    // Step 2: Update the previous active session to set is_active to false and provide the current date as end_date
    await pool.query(
      'UPDATE sessions SET is_active = FALSE, end_date = $1 WHERE session_name = $2',
      [currentDate, currentSessionName]
    );

    // Step 3: Insert the new session with the current date as start_date and set is_active = TRUE
    const result = await pool.query(
      'INSERT INTO sessions (session_name, start_date, is_active) VALUES ($1, $2, TRUE) RETURNING *',
      [session_name, currentDate]
    );

    const newSession = result.rows[0];

    // Step 4: Update courses assigned to the old active session, and assign the new session to those courses
    await pool.query(
      'UPDATE course SET session_name = $1 WHERE session_name = $2',
      [newSession.session_name, currentSessionName]  // Update only those courses associated with the last active session
    );

    // Step 5: Update teacher session to the new session
    await pool.query(
      'UPDATE teacher SET session_name = $1 WHERE session_name = $2',
      [newSession.session_name, currentSessionName]  // Update the session_name for teachers in the previous active session
    );

    res.status(201).json({
      message: 'New session added, courses and teacher sessions updated successfully',
      session: newSession,
    });

  } catch (err) {
    console.error('Error adding new session and updating courses and teacher sessions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
