const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// View pending users
router.get('/pending-students', async (req, res) => {
  try {
    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='student' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending-teachers', async (req, res) => {
  try {
    const result = await pool.query("SELECT login_id, email, user_type FROM LOGIN WHERE status = 'pending' AND user_type ='teacher' ");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add student basic data before approval
router.post('/add-student', async (req, res) => {
  const { login_id, level_term_id, department_id, hall_id, advisor_id } = req.body;

  try {
    // 1. Check if login_id exists and is a student
    const loginCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );
    if (loginCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid login_id: user does not exist' });
    }
    if (loginCheck.rows[0].user_type !== 'student') {
      return res.status(400).json({ message: 'login_id does not belong to a student' });
    }

    // 2. Validate level_term_id if provided
    if (level_term_id) {
      const ltCheck = await pool.query(
        'SELECT 1 FROM level_term WHERE level_term_id = $1',
        [level_term_id]
      );
      if (ltCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Invalid level_term_id' });
      }
    }

    // 3. Validate department_id if provided
    if (department_id) {
      const deptCheck = await pool.query(
        'SELECT 1 FROM department WHERE department_id = $1',
        [department_id]
      );
      if (deptCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Invalid department_id' });
      }
    }

    // 4. Validate hall_id if provided
    if (hall_id) {
      const hallCheck = await pool.query(
        'SELECT 1 FROM hall WHERE hall_id = $1',
        [hall_id]
      );
      if (hallCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Invalid hall_id' });
      }
    }

    // 5. Validate advisor_id if provided
    if (advisor_id) {
      const advisorCheck = await pool.query(
        'SELECT 1 FROM login WHERE login_id = $1 AND user_type = $2',
        [advisor_id, 'teacher']
      );
      if (advisorCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Invalid advisor_id: not found or not a teacher' });
      }
    }

    // 6. Check if student already exists
    const existingStudent = await pool.query(
      'SELECT 1 FROM student WHERE login_id = $1',
      [login_id]
    );
    if (existingStudent.rowCount > 0) {
      return res.status(400).json({ message: 'Student record already exists' });
    }

    // 7. Insert student (with nulls allowed for optional fields)
    await pool.query(
      `INSERT INTO student (login_id, level_term_id, department_id, hall_id, advisor_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        login_id,
        level_term_id || null,
        department_id || null,
        hall_id || null,
        advisor_id || null
      ]
    );

    res.status(200).json({ message: 'Student added successfully to student table' });

  } catch (err) {
    console.error('Error adding student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//add teacher 
router.post('/add-teacher', async (req, res) => {
  const { login_id, department_id, name, email, phone_number } = req.body;

  if (!login_id || !department_id) {
    return res.status(400).json({ message: 'login_id and department_id are required' });
  }

  try {
    const loginCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );

    if (loginCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid login_id: user does not exist' });
    }
    if (loginCheck.rows[0].user_type !== 'teacher') {
      return res.status(400).json({ message: 'login_id does not belong to a teacher' });
    }

    const deptCheck = await pool.query(
      'SELECT 1 FROM department WHERE department_id = $1',
      [department_id]
    );
    if (deptCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    const existing = await pool.query(
      'SELECT 1 FROM teacher WHERE login_id = $1',
      [login_id]
    );
    if (existing.rowCount > 0) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    await pool.query(
      `INSERT INTO teacher (login_id, department_id, name, email, phone_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        login_id,
        department_id,
        name || null,
        email || null,
        phone_number || null
      ]
    );

    res.status(200).json({ message: 'Teacher added successfully to teacher table' });

  } catch (err) {
    console.error('Error adding teacher:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// approve or reject
router.post('/verify', async (req, res) => {
  const { login_id, action } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    // First, get user_type
    const userCheck = await pool.query(
      'SELECT user_type FROM login WHERE login_id = $1',
      [login_id]
    );

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user_type = userCheck.rows[0].user_type;

    // If student and action is approve, check if student table has a row
    if (user_type === 'student' && action === 'approve') {
      const studentCheck = await pool.query(
        'SELECT 1 FROM student WHERE login_id = $1',
        [login_id]
      );

      if (studentCheck.rowCount === 0) {
        return res.status(400).json({ message: 'Student academic details not added. Cannot approve.' });
      }
    }

    // If teacher and action is approve, check if student table has a row
    if (user_type === 'teacher' && action === 'approve') {
      const studentCheck = await pool.query(
        'SELECT 1 FROM teacher WHERE login_id = $1',
        [login_id]
      );

      if (studentCheck.rowCount === 0) {
        return res.status(400).json({ message: 'teacher academic details not added. Cannot approve.' });
      }
    }

 if (action === 'reject') {
  // Get the user_type first
  const result = await pool.query(
    'SELECT user_type FROM login WHERE login_id = $1',
    [login_id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'User not found in login table' });
  }

  const user_type = result.rows[0].user_type;

  // Remove from appropriate table
  if (user_type === 'student') {
    await pool.query('DELETE FROM student WHERE student_id = $1', [login_id]);
  } else if (user_type === 'teacher') {
    await pool.query('DELETE FROM teacher WHERE teacher_id = $1', [login_id]);
  }

  // Now remove from login
  await pool.query('DELETE FROM login WHERE login_id = $1', [login_id]);

  return res.status(200).json({ message: 'User rejected and all records deleted.' });
}


    // Approve the user
    await pool.query(
      'UPDATE login SET status = $1 WHERE login_id = $2',
      ['approved', login_id]
    );

    res.status(200).json({ message: 'User approved successfully.' });

  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/add-course
router.post('/add-course', async (req, res) => {
  const { course_id, department_id, level_term_id, title, credit } = req.body;

  // Validate input
  if (!course_id || !department_id || !level_term_id || !title || !credit) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if course already exists
    const existing = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (existing.rowCount > 0) {
      return res.status(400).json({ message: 'Course with this ID already exists' });
    }

    // Validate department
    const deptCheck = await pool.query('SELECT 1 FROM department WHERE department_id = $1', [department_id]);
    if (deptCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid department_id' });
    }

    // Validate level_term
    const ltCheck = await pool.query('SELECT 1 FROM level_term WHERE level_term_id = $1', [level_term_id]);
    if (ltCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid level_term_id' });
    }

    // Insert course
    await pool.query(
      `INSERT INTO course (course_id, department_id, level_term_id, title, credit)
       VALUES ($1, $2, $3, $4, $5)`,
      [course_id, department_id, level_term_id, title, credit]
    );

    res.status(201).json({ message: 'Course added successfully' });

  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/drop-course
router.post('/drop-course', async (req, res) => {
  const { course_id } = req.body;

  try {
    // Check if the course exists
    const courseCheck = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Step 1: Remove the teacher-course relationship
    await pool.query('DELETE FROM teacher_course WHERE course_id = $1', [course_id]);

    // Step 2: Remove the student enrollment
    await pool.query('DELETE FROM enrollment WHERE course_id = $1', [course_id]);

    // Step 3: Remove the course itself
    await pool.query('DELETE FROM course WHERE course_id = $1', [course_id]);

    res.status(200).json({ message: 'Course dropped successfully' });
  } catch (err) {
    console.error('Error dropping course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});





// GET /api/admin/courses
router.get('/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, d.name AS department_name
      FROM course c
      LEFT JOIN department d ON c.department_id = d.department_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/admin/assign-teacher
router.post('/assign-teacher', async (req, res) => {
  const { course_id, login_id } = req.body;

  if (!course_id || !login_id) {
    return res.status(400).json({ message: 'course_id and login_id are required' });
  }

  try {
    // Check if course exists
    const courseCheck = await pool.query('SELECT 1 FROM course WHERE course_id = $1', [course_id]);
    if (courseCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid course_id' });
    }

    // Check if teacher exists
    const teacherCheck = await pool.query('SELECT 1 FROM teacher WHERE login_id = $1', [login_id]);
    if (teacherCheck.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid teacher login_id' });
    }

    // Check if already assigned
    const alreadyAssigned = await pool.query(
      'SELECT 1 FROM teacher_course WHERE course_id = $1 AND login_id = $2',
      [course_id, login_id]
    );
    if (alreadyAssigned.rowCount > 0) {
      return res.status(409).json({ message: 'Teacher is already assigned to this course' });
    }

    // Insert teacher-course relation
    await pool.query(
      'INSERT INTO teacher_course (course_id, login_id) VALUES ($1, $2)',
      [course_id, login_id]
    );

    res.status(201).json({ message: 'Teacher successfully assigned to course' });
  } catch (err) {
    console.error('Assign teacher error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

