// routes/teacher.js
const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authenticateToken = require("../middleware/auth");

// POST /api/teacher/view-enrollment-requests
router.get('/view-enrollment-requests', authenticateTeacher, async (req, res) => {
  const login_id = req.user.login_id;  // Logged-in teacher's login_id

  try {
    // Fetch the enrollment requests for students assigned to this advisor
    const result = await pool.query(
      `SELECT * FROM enrollment_requests 
       WHERE advisor_id = $1 AND status = 'pending'`,
      [login_id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No pending enrollment requests found' });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching enrollment requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST /api/teacher/approve-enrollment
router.post('/approve-enrollment', authenticateTeacher, async (req, res) => {
  const { enrollment_request_id, action } = req.body;  // action = 'approve' or 'reject'
  const login_id = req.user.login_id;

  try {
    // Fetch the enrollment request details
    const enrollmentRequest = await pool.query(
      'SELECT login_id, selected_courses, advisor_id FROM enrollment_requests WHERE enrollment_request_id = $1',
      [enrollment_request_id]
    );
    
    if (enrollmentRequest.rowCount === 0) {
      return res.status(400).json({ message: 'Enrollment request not found' });
    }

    const studentLoginId = enrollmentRequest.rows[0].login_id;
    const advisorId = enrollmentRequest.rows[0].advisor_id;

    // Verify the advisor is assigned to this student
    if (advisorId !== login_id) {
      return res.status(403).json({ message: 'You are not the advisor of this student' });
    }

    // Handle the approval/rejection
    if (action === 'approve') {
      const selectedCourses = enrollmentRequest.rows[0].selected_courses;

      // Insert the selected courses into the enrollment table
      for (const course_id of selectedCourses) {
        // No need to insert level_term_id, course_id is enough
        await pool.query(
          'INSERT INTO enrollment (login_id, course_id) VALUES ($1, $2)',
          [studentLoginId, course_id]
        );
      }

      // Update the enrollment request status to 'approved'
      await pool.query(
        'UPDATE enrollment_requests SET status = $1 WHERE enrollment_request_id = $2',
        ['approved', enrollment_request_id]
      );

      res.status(200).json({ message: 'Enrollment approved successfully' });
    } else if (action === 'reject') {
      // Update the enrollment request status to 'rejected'
      await pool.query(
        'UPDATE enrollment_requests SET status = $1 WHERE enrollment_request_id = $2',
        ['rejected', enrollment_request_id]
      );

      res.status(200).json({ message: 'Enrollment rejected' });
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } catch (err) {
    console.error('Error approving enrollment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;