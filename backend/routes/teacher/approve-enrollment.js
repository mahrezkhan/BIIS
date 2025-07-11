// routes/teacher.js
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// POST /api/teacher/approve-enrollment
router.post('/approve-enrollment', authenticateToken, async (req, res) => {
  const { student_id, action } = req.body;  // action = 'approve' or 'reject'
  const login_id = req.user.login_id;

  try {
    // Fetch the enrollment request details
    const enrollmentRequest = await pool.query(
      'SELECT login_id, selected_courses, advisor_id, enrollment_request_id FROM enrollment_requests WHERE login_id = $1 AND status = $2',
      [student_id, 'pending']  // Ensuring 'pending' status is used correctly
    );
    
    if (enrollmentRequest.rowCount === 0) {
      return res.status(400).json({ message: 'Enrollment request not found or already processed' });
    }

    const studentLoginId = enrollmentRequest.rows[0].login_id;
    const advisorId = enrollmentRequest.rows[0].advisor_id;
    const enrollmentRequestId = enrollmentRequest.rows[0].enrollment_request_id;

    // Verify the advisor is assigned to this student
    if (advisorId !== login_id) {
      return res.status(403).json({ message: 'You are not the advisor of this student' });
    }

    // Handle the approval/rejection
    if (action === 'approve') {
      // Simply update the status to 'approved'
      await pool.query(
        'UPDATE enrollment_requests SET status = $1 WHERE enrollment_request_id = $2',
        ['approved', enrollmentRequestId]  // Trigger will handle course enrollment automatically
      );

      res.status(200).json({ message: 'Enrollment approved successfully' });
    } else if (action === 'reject') {
      // Update the enrollment request status to 'rejected'
      await pool.query(
        'UPDATE enrollment_requests SET status = $1 WHERE enrollment_request_id = $2',
        ['rejected', enrollmentRequestId]  // Trigger will not be fired for rejection
      );

      res.status(200).json({ message: 'Enrollment rejected' });
    } else {
      res.status(400).json({ message: 'Invalid action. Only "approve" or "reject" are allowed.' });
    }
  } catch (err) {
    console.error('Error approving enrollment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
