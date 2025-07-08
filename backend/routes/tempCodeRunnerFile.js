// GET /api/student/available-courses
router.get('/available-courses', authenticateStudent, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    // Get the student's level_term_id and department_id
    const student = await pool.query(
      'SELECT level_term_id, department_id FROM student WHERE login_id = $1', [login_id]
    );

    if (student.rowCount === 0) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const { level_term_id, department_id } = student.rows[0];

    // Fetch courses available for the student's level_term_id and department_id
    const courses = await pool.query(
      `SELECT course_id, title, credit
       FROM course
       WHERE level_term_id = $1 AND department_id = $2`,
      [level_term_id, department_id]
    );

    if (courses.rowCount === 0) {
      return res.status(400).json({ message: 'No courses available for this level/term and department' });
    }

    res.status(200).json(courses.rows);
  } catch (err) {
    console.error('Error fetching available courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});