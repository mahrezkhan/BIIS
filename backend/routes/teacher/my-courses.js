const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/teacher/my-courses
router.get("/my-courses", authenticateToken, async (req, res) => {
  const teacher_id = req.user.login_id;
  

  try {
    const sessionResult = await pool.query('SELECT * FROM get_active_session()'); // Call your function here
    const activeSession = sessionResult.rows[0].session_name;
    // Fetch the courses assigned to the teacher for the current session
    const coursesResult = await pool.query(
      `SELECT c.course_id, c.title 
       FROM course c 
       JOIN teacher_course tc 
       ON c.course_id = tc.course_id 
       WHERE tc.login_id = $1 
       AND c.session_name = $2`, // Ensure the session is checked here
      [teacher_id, activeSession]
    );

    if (coursesResult.rowCount === 0) {
      return res.status(404).json({ message: "No courses found for this teacher in the current session" });
    }

    res.status(200).json(coursesResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
