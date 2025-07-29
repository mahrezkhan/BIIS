const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");

// Update current student profile with transaction support
router.put("/edit-profile", authenticateToken, async (req, res) => {
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

  const client = await pool.connect(); // Get a database client for transaction

  try {
    await client.query('BEGIN'); // Start the transaction

    const result = await client.query(
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

    await client.query('COMMIT'); // Commit the transaction if successful

    res.json({ message: "Profile updated", student: result.rows[0] });
  } catch (err) {
    console.error(err);
    await client.query('ROLLBACK'); // Rollback the transaction if an error occurs
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;
