const express = require('express');
const router = express.Router();
const pool = require('../../db/db');
const authenticateToken = require("../../middleware/auth");

// POST /api/admin/add-fee
router.post('/add-fee', authenticateToken, async (req, res) => {
  const { fee_type, amount, due_date, hall_id, level_term_id } = req.body; // fee_type can be 'hall_fee', 'dining_fee', 'registration_fee'
  const admin_login_id = req.user.login_id;

  // Validate input fields
  if (!fee_type || !amount || !due_date) {
    return res.status(400).json({ message: "Fee type, amount, and due date are required." });
  }

  try {
    // Step 1: Get active session
    const sessionResult = await pool.query('SELECT * FROM get_active_session()'); 

    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ message: 'No active session found' });
    }
    const activeSession = sessionResult.rows[0].session_name;

    // Step 2: Build dynamic query based on the fee type
    let filterQuery = '';
    let queryParams = [];

    // Hall Fee Logic: Filter by Hall ID, Level Term ID, and Active Session
    if (fee_type === 'hall_fee' && hall_id && level_term_id) {
      filterQuery = 'SELECT login_id FROM student WHERE hall_id = $1 AND level_term_id = $2 AND session_name = $3';
      queryParams = [hall_id, level_term_id, activeSession];
    }
    // Dining Fee Logic: Filter by Hall ID and Active Session
    else if (fee_type === 'dining_fee' && hall_id) {
      filterQuery = 'SELECT login_id FROM student WHERE hall_id = $1 AND session_name = $2';
      queryParams = [hall_id, activeSession];
    }
    // Registration Fee Logic: Filter by Level Term ID
    else if (fee_type === 'registration_fee' && level_term_id) {
      filterQuery = 'SELECT login_id FROM student WHERE level_term_id = $1 AND session_name = $2';
      queryParams = [level_term_id, activeSession];
    } else {
      return res.status(400).json({ message: "Invalid fee type or missing required fields." });
    }

    // Step 3: Fetch the filtered students
    const students = await pool.query(filterQuery, queryParams);

    if (students.rowCount === 0) {
      return res.status(404).json({ message: 'No students found for the selected criteria' });
    }

    // Step 4: Add the dues for each student
    // Modify the due_code to use abbreviated prefix (df, hf, rf)
    let feePrefix = '';
    if (fee_type === 'dining_fee') feePrefix = 'df';
    if (fee_type === 'hall_fee') feePrefix = 'hf';
    if (fee_type === 'registration_fee') feePrefix = 'rf';

    const dueCode = `${feePrefix}_${Date.now()}`; // Unique due code based on fee type and timestamp
    const status = 'unpaid';

    for (const student of students.rows) {
      await pool.query(
        `INSERT INTO dues (due_code, login_id, dues_type, due_date, status, amount, transaction_operator, transaction_id, account_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [dueCode, student.login_id, fee_type, due_date, status, amount, admin_login_id, 'N/A', 'N/A']
      );
    }

    res.status(200).json({ message: `Successfully added ${fee_type} for selected students.` });

  } catch (err) {
    console.error('Error adding fee:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
