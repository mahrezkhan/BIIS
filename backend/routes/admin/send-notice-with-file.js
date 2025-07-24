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
    // Ensure uploads directory exists
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize title to create a safe filename
    const sanitizedTitle = req.body.title ? req.body.title.replace(/[^a-zA-Z0-9]/g, '_') : 'file';
    const fileName = `${sanitizedTitle}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Verify the field name is 'file'
    if (file.fieldname !== 'file') {
      return cb(new Error('Field name must be "file"'));
    }
    cb(null, true);
  }
});

// POST /api/admin/send-notice-with-file
router.post("/send-notice-with-file", authenticateToken, (req, res, next) => {
  // Debugging middleware
  console.log("Content-Type:", req.headers['content-type']);
  
  // Handle the file upload
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ 
        message: 'File upload failed',
        error: err.message 
      });
    }
    next();
  });
}, async (req, res) => {
  const { title, content, receiver_type } = req.body;
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  
  const admin_login_id = req.user.login_id;
  const file = req.file;

  if (!title || !content || !receiver_type) {
    // Clean up uploaded file if validation fails
    if (file) fs.unlinkSync(file.path);
    return res.status(400).json({ message: "All fields (title, content, receiver_type) are required" });
  }

  try {
    // Ensure the user is an admin
    if (req.user.user_type !== 'admin') {
      if (file) fs.unlinkSync(file.path);
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Step 1: Fetch the current active session using the function
    const sessionResult = await pool.query('SELECT * FROM get_active_session()');

    if (sessionResult.rowCount === 0) {
      if (file) fs.unlinkSync(file.path);
      return res.status(404).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Step 2: Insert the notice into the NOTICE table
    const filePath = file ? file.path.replace('uploads/', '') : null;

    const noticeResult = await pool.query(
      `INSERT INTO NOTICE (NOTICE_DATE, TITLE, CONTENT, RECEIVER_TYPE, FILE_PATH) 
       VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING NOTICE_ID`,
      [title, content, receiver_type, filePath]
    );

    const noticeId = noticeResult.rows[0].notice_id;

    // Step 3: Insert the notice into NOTICE_STUDENT or NOTICE_TEACHER based on the receiver_type
    if (receiver_type === 'student' || receiver_type === 'both') {
      const students = await pool.query(
        'SELECT LOGIN_ID FROM STUDENT WHERE session_name = $1',
        [activeSession]
      );
      const studentIds = students.rows.map(row => row.login_id);
      for (const studentId of studentIds) {
        await pool.query(
          `INSERT INTO NOTICE_STUDENT (NOTICE_ID, LOGIN_ID) VALUES ($1, $2)`,
          [noticeId, studentId]
        );
      }
    }

    if (receiver_type === 'teacher' || receiver_type === 'both') {
      const teachers = await pool.query(
        'SELECT LOGIN_ID FROM TEACHER WHERE session_name = $1',
        [activeSession]
      );
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
    if (file) fs.unlinkSync(file.path); // Clean up file on error
    res.status(500).json({ message: "Server error" });
  }
});

// Route for downloading the notice file
router.get('/download-notice/:noticeId', async (req, res) => {
  const { noticeId } = req.params;

  try {
    const noticeResult = await pool.query(
      'SELECT file_path FROM notice WHERE notice_id = $1',
      [noticeId]
    );

    if (noticeResult.rowCount === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', noticeResult.rows[0].file_path);

    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error sending the file:', err);
          res.status(500).json({ message: 'Error downloading file' });
        }
      });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/student/notices or /api/teacher/notices
router.get("/notices", authenticateToken, async (req, res) => {
  const userId = req.user.login_id; // Get the logged-in user's login_id
  const userType = req.user.user_type; // Either 'student' or 'teacher'
  
  try {
    // Fetch the current active session
    const sessionResult = await pool.query('SELECT * FROM get_active_session()');

    if (sessionResult.rowCount === 0) {
      return res.status(404).json({ message: 'No active session found' });
    }

    const activeSession = sessionResult.rows[0].session_name;

    // Step 1: Retrieve notices based on user type (student or teacher)
    let noticesQuery;
    if (userType === 'student') {
      // If the user is a student, fetch notices for them
      noticesQuery = `
        SELECT n.notice_id, n.notice_date, n.title, n.content, n.file_path 
        FROM notice n
        JOIN notice_student ns ON n.notice_id = ns.notice_id
        WHERE ns.login_id = $1
        AND EXISTS (
          SELECT 1 FROM student s WHERE s.login_id = ns.login_id AND s.session_name = $2
        )`;
    } else if (userType === 'teacher') {
      // If the user is a teacher, fetch notices for them
      noticesQuery = `
        SELECT n.notice_id, n.notice_date, n.title, n.content, n.file_path
        FROM notice n
        JOIN notice_teacher nt ON n.notice_id = nt.notice_id
        WHERE nt.login_id = $1
        AND EXISTS (
          SELECT 1 FROM teacher t WHERE t.login_id = nt.login_id AND t.session_name = $2
        )`;
    } else {
      return res.status(403).json({ message: 'Invalid user type' });
    }

    const noticesResult = await pool.query(noticesQuery, [userId, activeSession]);

    if (noticesResult.rowCount === 0) {
      return res.status(404).json({ message: 'No notices found for this user' });
    }

    res.status(200).json(noticesResult.rows);

  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;