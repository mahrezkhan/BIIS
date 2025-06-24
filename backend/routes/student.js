// routes/student.js
const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const authenticateToken = require("../middleware/auth");

// Get current student profile


router.get("/me", authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;

  try {
    const result = await pool.query(
      `SELECT
        s.login_id AS "User ID",s.name AS Name,s.mobile_banking_method,
        s.mobile_banking_account,
       ('Level-' || lt.level ||',Term-'|| lt.term) AS "Level/Term",
       d.department_id AS Department,
       h.hall_name AS Hall ,t.name AS "Advisor Name", 
       s.birth_registration_no AS "Birth Registration No", s.birth_date AS "Birth Date", s.nid NID,
       s.bank_account_number, s.email, s.district, s.upazilla,
       s.additional_address, s.contact_person_name, s.contact_person_address, s.contact_person_mobile_number
       FROM student s
       LEFT JOIN level_term lt ON s.level_term_id=lt.level_term_id
       LEFT JOIN department d on s.department_id=d.department_id
       LEFT JOIN hall h on s.hall_id=h.hall_id
       LEFT JOIN teacher t on s.advisor_id=t.login_id
       WHERE s.login_id=$1`,
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

// Update current student profile
router.put("/me", authenticateToken, async (req, res) => {
  const login_id = req.user.login_id;
  const {
    name,
    email,
    mobile_number,
    district,
    upazilla,
    additional_address,
    contact_person_name,
    contact_person_address,
    contact_person_mobile_number,
    birth_registration_no,
    birth_date,
    nid,
    bank_account_number,
    mobile_banking_method,
    mobile_banking_account
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE STUDENT
       SET name = $1, email = $2, mobile_number = $3,
           district = $4, upazilla = $5, additional_address = $6,
           contact_person_name = $7, contact_person_address = $8,
           contact_person_mobile_number=$9,
           birth_registration_no=$10,
           birth_date=$11,
           nid=$12,
           bank_account_number = $13,
           mobile_banking_method= $14,
          mobile_banking_account = $15
       WHERE login_id = $16
       RETURNING *`,
      [
        name,
        email,
        mobile_number,
        district,
        upazilla,
        additional_address,
        contact_person_name,
        contact_person_address,
        contact_person_mobile_number,
        birth_registration_no,
        birth_date,
        nid,
        bank_account_number,
        mobile_banking_method,
        mobile_banking_account,
        login_id
      ]
    );

    res.json({ message: "Profile updated", student: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
