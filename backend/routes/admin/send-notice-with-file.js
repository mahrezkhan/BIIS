
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");
// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');  // Directory to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Sanitize title to create a safe filename
    const sanitizedTitle = req.body.title.replace(/[^a-zA-Z0-9]/g, '_');  // Replace non-alphanumeric characters with underscores
    const fileName = `${sanitizedTitle}_${Date.now()}${path.extname(file.originalname)}`;  // Append timestamp for uniqueness
    cb(null, fileName);  // Save the file with the sanitized title and timestamp
  }
});
const upload = multer({ storage: storage });

// POST /api/admin/send-notice-with-file
router.post("/send-notice-with-file", authenticateToken, upload.single("file"), async (req, res) => {
  const { title, content, receiver_type } = req.body; // receiver_type could be 'student', 'teacher', or 'both'
  const admin_login_id = req.user.login_id; // Get the admin's login ID from the token
  const file = req.file; // Uploaded file

  if (!title || !content || !receiver_type) {
    return res.status(400).json({ message: "All fields (title, content, receiver_type) are required" });
  }

  try {
    // Check if the user is an admin (assuming `req.user` is set after authentication)
    if (req.user.user_type !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Insert the notice into the NOTICE table
    const filePath = file ? file.path.replace('uploads/', '') : null; // Remove 'uploads/' from the path before saving it to the DB


    const noticeResult = await pool.query(
      `INSERT INTO NOTICE (NOTICE_DATE, TITLE, CONTENT, RECEIVER_TYPE, FILE_PATH)
       VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING NOTICE_ID`,
      [title, content, receiver_type, filePath]
    );

    const noticeId = noticeResult.rows[0].notice_id;

    // Step 2: Insert the notice into NOTICE_STUDENT or NOTICE_TEACHER based on the receiver_type
    if (receiver_type === 'student' || receiver_type === 'both') {
      // Insert notice for all students
      const students = await pool.query('SELECT LOGIN_ID FROM STUDENT');
      const studentIds = students.rows.map(row => row.login_id);
      for (const studentId of studentIds) {
        await pool.query(
          `INSERT INTO NOTICE_STUDENT (NOTICE_ID, LOGIN_ID) VALUES ($1, $2)`,
          [noticeId, studentId]
        );
      }
    }

    if (receiver_type === 'teacher' || receiver_type === 'both') {
      // Insert notice for all teachers
      const teachers = await pool.query('SELECT LOGIN_ID FROM TEACHER');
      const teacherIds = teachers.rows.map(row => row.login_id);
      for (const teacherId of teacherIds) {
        await pool.query(
          `INSERT INTO NOTICE_TEACHER (NOTICE_ID, LOGIN_ID) VALUES ($1, $2)`,
          [noticeId, teacherId]
        );
      }
    }

    res.status(200).json({ message: "Notice sent successfully" });

  } catch (err) {
    console.error("Error sending notice:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for downloading the notice file
router.get('/download-notice/:noticeId', async (req, res) => {
  const { noticeId } = req.params; // Get the noticeId from the route params

  try {
    // Fetch the notice record from the database
    const noticeResult = await pool.query(
      'SELECT file_path FROM notice WHERE notice_id = $1',
      [noticeId]
    );

    if (noticeResult.rowCount === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Get the file path stored in the database
    const filePath = path.join(__dirname, '../../uploads', noticeResult.rows[0].file_path);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Send the file as a response
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error sending the file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
      });
    } else {
      // If the file does not exist
      res.status(404).json({ message: 'File not found' });
    }
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
