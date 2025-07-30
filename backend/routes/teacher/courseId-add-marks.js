const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

router.post('/:courseId/add-marks', authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  const { student_id, CT_marks, TF_marks, attendance_marks, total_possible_marks } = req.body;
  const teacher_id = req.user.login_id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Step 1: Get the active session
    const sessionResult = await client.query(
      'SELECT session_name FROM sessions WHERE is_active = TRUE'
    );

    if (sessionResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Step 2: Check teacher assignment
    const teacherCourseCheck = await client.query(
      `SELECT 1 
       FROM teacher_course tc 
       JOIN course c ON tc.course_id = c.course_id 
       WHERE tc.login_id = $1 AND tc.course_id = $2 AND c.session_name = $3`,
      [teacher_id, courseId, activeSession]
    );

    if (teacherCourseCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'You are not assigned to this course for the current session' });
    }

    // Step 3: Check student enrollment
    const enrollmentCheck = await client.query(
      `SELECT 1 
       FROM enrollment e
       JOIN course c ON e.course_id = c.course_id 
       WHERE e.login_id = $1 AND e.course_id = $2 AND c.session_name = $3`,
      [student_id, courseId, activeSession]
    );

    if (enrollmentCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Student is not enrolled in this course for the current session' });
    }

    // Step 4: First try to update existing marks
    const updateResult = await client.query(
      `UPDATE marks 
       SET CT_marks = COALESCE($3, CT_marks),
           TF_marks = COALESCE($4, TF_marks),
           attendance_marks = COALESCE($5, attendance_marks),
           total_possible_marks = COALESCE($6, total_possible_marks),
           teacher_id = $7
       WHERE student_id = $1 AND course_id = $2
       RETURNING *`,
      [
        student_id, 
        courseId, 
        CT_marks || null, 
        TF_marks || null, 
        attendance_marks || null, 
        total_possible_marks || null, 
        teacher_id
      ]
    );

    // If no rows were updated, insert new marks
    if (updateResult.rowCount === 0) {
      await client.query(
        `INSERT INTO marks 
         (student_id, course_id, CT_marks, TF_marks, attendance_marks, total_possible_marks, teacher_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          student_id, 
          courseId, 
          CT_marks || null, 
          TF_marks || null, 
          attendance_marks || null, 
          total_possible_marks || null, 
          teacher_id
        ]
      );
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Marks added/updated successfully' });

  } catch (err) {
    console.error('Error adding marks:', err);
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;