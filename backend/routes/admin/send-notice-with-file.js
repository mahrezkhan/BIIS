const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const authenticateToken = require("../../middleware/auth");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedTitle = req.body.title ? req.body.title.replace(/[^a-zA-Z0-9]/g, '_') : 'file';
    const fileName = `${sanitizedTitle}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== 'file') {
      return cb(new Error('Field name must be "file"'));
    }
    cb(null, true);
  }
});

// POST /api/admin/send-notice-with-file
router.post("/send-notice-with-file", authenticateToken, (req, res, next) => {
  console.log("Content-Type:", req.headers['content-type']);
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { title, content, receiver_type } = req.body;
  const admin_login_id = req.user.login_id;
  const file = req.file;

  if (!title || !content || !receiver_type) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ message: "All fields (title, content, receiver_type) are required" });
  }

  const client = await pool.connect();  // Get a database client for transaction
  try {
    await client.query('BEGIN'); // Start the transaction

    if (req.user.user_type !== 'admin') {
      if (file) fs.unlinkSync(file.path);
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    const sessionResult = await client.query('SELECT * FROM get_active_session()');
    if (sessionResult.rowCount === 0) {
      if (file) fs.unlinkSync(file.path);
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    const filePath = file ? file.path.replace('uploads/', '') : null;

    const noticeResult = await client.query(
      `INSERT INTO NOTICE (NOTICE_DATE, TITLE, CONTENT, RECEIVER_TYPE, FILE_PATH) 
       VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING NOTICE_ID`,
      [title, content, receiver_type, filePath]
    );

    const noticeId = noticeResult.rows[0].notice_id;

    if (receiver_type === 'student' || receiver_type === 'both') {
      const students = await client.query(
        'SELECT LOGIN_ID FROM STUDENT WHERE session_name = $1',
        [activeSession]
      );
      const studentIds = students.rows.map(row => row.login_id);
      for (const studentId of studentIds) {
        await client.query(
          `INSERT INTO NOTICE_STUDENT (NOTICE_ID, LOGIN_ID) VALUES ($1, $2)`,
          [noticeId, studentId]
        );
      }
    }

    if (receiver_type === 'teacher' || receiver_type === 'both') {
      const teachers = await client.query(
        'SELECT LOGIN_ID FROM TEACHER WHERE session_name = $1',
        [activeSession]
      );
      const teacherIds = teachers.rows.map(row => row.login_id);
      for (const teacherId of teacherIds) {
        await client.query(
          `INSERT INTO NOTICE_TEACHER (NOTICE_ID, LOGIN_ID) VALUES ($1, $2)`,
          [noticeId, teacherId]
        );
      }
    }

    await client.query('COMMIT'); // Commit the transaction
    res.status(200).json({ message: "Notice sent successfully" });

  } catch (err) {
    console.error("Error sending notice:", err);
    if (file) fs.unlinkSync(file.path);  // Clean up file on error
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();  // Release the client back to the pool
  }
});

module.exports = router;
