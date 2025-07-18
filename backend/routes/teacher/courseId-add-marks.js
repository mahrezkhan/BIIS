const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

router.post('/:courseId/add-marks', authenticateToken, async (req, res) => {
  const { courseId } = req.params;  // Get courseId from route parameter
  const { student_id, CT_marks, TF_marks, attendance_marks } = req.body;  // Marks input from request body
  const teacher_id = req.user.login_id;  // Get teacher's login ID from token

  try {
    // 1. Check if the teacher is assigned to the course
    const teacherCourseCheck = await pool.query(
      'SELECT 1 FROM teacher_course WHERE login_id = $1 AND course_id = $2',
      [teacher_id, courseId]
    );

    if (teacherCourseCheck.rowCount === 0) {
      return res.status(403).json({ message: 'You are not assigned to this course' });
    }

    // 2. Check if the student is enrolled in the course
    const enrollmentCheck = await pool.query(
      'SELECT 1 FROM enrollment WHERE login_id = $1 AND course_id = $2',
      [student_id, courseId]
    );

    if (enrollmentCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Student is not enrolled in this course' });
    }

    // 3. Insert marks into the marks table, ensuring NULL is allowed if not provided
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
