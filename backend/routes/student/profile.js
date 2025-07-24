// routes/student.js
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Get current student profile
router.get("/profile", authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    const result = await pool.query(
      `SELECT
        s.login_id AS "User_ID",
        s.name AS Name,
        s.mobile_banking_method,
        s.mobile_banking_account,
        ('Level-' || lt.level || ',Term-' || lt.term) AS "Level/Term",
        d.department_id AS Department,
        h.hall_name AS Hall,
        t.name AS "Advisor_Name", 
        s.birth_registration_no AS "Birth_Registration_No",
        s.birth_date AS "Birth_Date", 
        s.nid AS NID,
        s.bank_account_number,
        s.email,
        s.district,
        s.upazilla,
        s.additional_address,
        s.contact_person_name,
        s.contact_person_address,
        s.contact_person_mobile_number,
        s.mobile_number,
        s.session AS "Session"  -- Added session
       FROM student s
       LEFT JOIN level_term lt ON s.level_term_id = lt.level_term_id
       LEFT JOIN department d ON s.department_id = d.department_id
       LEFT JOIN hall h ON s.hall_id = h.hall_id
       LEFT JOIN teacher t ON s.advisor_id = t.login_id
       WHERE s.login_id = $1`,
       [login_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'Profile incomplete',
        needsProfileSetup: true
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
