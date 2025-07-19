const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// GET /api/teacher/course/:courseId/students
router.get("/course/:courseId/students", authenticateToken, async (req, res) => {
  const teacher_id = req.user.login_id; // Get the teacher's login_id from the token
  const { courseId } = req.params; // Get the course ID from the URL parameters

  try {
    // Step 1: Check if the teacher is assigned to the course
    const courseCheck = await pool.query(
      `SELECT 1 
       FROM teacher_course tc
       WHERE tc.login_id = $1 AND tc.course_id = $2`,
      [teacher_id, courseId]
    );

    if (courseCheck.rowCount === 0) {
      return res.status(403).json({ message: 'You are not assigned to this course' });
    }

    // Step 2: Get the list of students and their marks for the course
    const studentsResult = await pool.query(
  `SELECT 
    s.login_id, 
    COALESCE(m.ct_marks, NULL) AS "CT Marks", 
    COALESCE(m.tf_marks, NULL) AS "TF Marks", 
    COALESCE(m.attendance_marks, NULL) AS "Attendance Marks"
  FROM enrollment e
  LEFT JOIN marks m ON m.student_id = e.login_id AND m.course_id = e.course_id
  JOIN student s ON s.login_id = e.login_id
  WHERE e.course_id = $1`,
  [courseId]
);


    if (studentsResult.rowCount === 0) {
      return res.status(404).json({ message: 'No students enrolled in this course' });
    }

    // Step 3: Return the student list with marks
    res.status(200).json(studentsResult.rows);

  } catch (err) {
    console.error('Error fetching students for the course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;