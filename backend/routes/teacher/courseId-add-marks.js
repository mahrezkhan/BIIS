const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

router.post('/:courseId/add-marks', authenticateToken, async (req, res) => {
  const { courseId } = req.params;  // Get courseId from route parameter
  const { student_id, CT_marks, TF_marks, attendance_marks } = req.body;  // Marks input from request body
  const teacher_id = req.user.login_id;  // Get teacher's login ID from token

  try {
    // Step 1: Get the active session
    const sessionResult = await pool.query(
      'SELECT session_name FROM sessions WHERE is_active = TRUE'
    );

    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Step 2: Check if the teacher is assigned to the course for the active session
    const teacherCourseCheck = await pool.query(
      `SELECT 1 
       FROM teacher_course tc 
       JOIN course c ON tc.course_id = c.course_id 
       WHERE tc.login_id = $1 AND tc.course_id = $2 AND c.session_name = $3`,
      [teacher_id, courseId, activeSession]
    );

    if (teacherCourseCheck.rowCount === 0) {
      return res.status(403).json({ message: 'You are not assigned to this course for the current session' });
    }

    // Step 3: Check if the student is enrolled in the course for the active session
    const enrollmentCheck = await pool.query(
      `SELECT 1 
       FROM enrollment e
       JOIN course c ON e.course_id = c.course_id 
       WHERE e.login_id = $1 AND e.course_id = $2 AND c.session_name = $3`,
      [student_id, courseId, activeSession]
    );

    if (enrollmentCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Student is not enrolled in this course for the current session' });
    }

    // Step 4: Insert or update the marks into the marks table
    const result = await pool.query(
      `INSERT INTO marks (student_id, course_id, CT_marks, TF_marks, attendance_marks, teacher_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (student_id, course_id) DO UPDATE
       SET CT_marks = COALESCE(EXCLUDED.CT_marks, marks.CT_marks),
           TF_marks = COALESCE(EXCLUDED.TF_marks, marks.TF_marks),
           attendance_marks = COALESCE(EXCLUDED.attendance_marks, marks.attendance_marks)`,
      [
        student_id, 
        courseId, 
        CT_marks || null, 
        TF_marks || null, 
        attendance_marks || null, 
        teacher_id
      ]
    );

    res.status(200).json({ message: 'Marks added successfully' });
  } catch (err) {
    console.error('Error adding marks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
