const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./db/db');

dotenv.config();

const app = express();
// const studentRoutes = require('./routes/student');
// const teacherRoutes = require('./routes/teacher');
// const adminRoutes = require('./routes/admin');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use((req, res, next) => {
  //console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});



app.get('/', (req, res) => {
  res.send('Server is working');
  
});

// Routes
app.use('/api/auth', require('./routes/auth'));       // signup, signin
app.use('/api', require('./routes/protected'));      // JWT-protected demo route
//const studentRoutes = require('./routes/student');
// app.use('/api/student', studentRoutes);              // student-specific info
// app.use('/api/teacher',teacherRoutes);
// app.use('/api/admin', adminRoutes);     // verify, pending users
//student
app.use('/api/student',require('./routes/student/available-courses'));
app.use('/api/student',require('./routes/student/edit-profile'));
app.use('/api/student',require('./routes/student/enroll'));
app.use('/api/student',require('./routes/student/profile'));
app.use('/api/student',require('./routes/admin/send-notice-with-file'));
app.use('/api/student',require('./routes/student/pay-fee'));
app.use('/api/student',require('./routes/student/payment-history'));
app.use('/api/student',require('./routes/student/unpaid-dues'));
app.use('/api/student',require('./routes/student/view-requests'));
app.use('/api/student',require('./routes/student/create-request'));
app.use('/api/student',require('./routes/student/view-courses'));
app.use('/api/student',require('./routes/student/view-cgpa-for-level-term'));
app.use('/api/student',require('./routes/student/view-level-term-for-grade'));


//teacher
app.use('/api/teacher',require('./routes/teacher/view-enrollment-requests'));
app.use('/api/teacher',require('./routes/teacher/approve-enrollment'));
app.use('/api/teacher',require('./routes/teacher/my-courses'));
app.use('/api/teacher',require('./routes/teacher/courseId-student'));
app.use('/api/teacher',require('./routes/teacher/courseId-add-marks'));
app.use('/api/teacher',require('./routes/admin/send-notice-with-file'));

//admin
app.use('/api/admin', require('./routes/admin/add-course'));     
app.use('/api/admin', require('./routes/admin/add-student'));     
app.use('/api/admin', require('./routes/admin/add-teacher'));     
app.use('/api/admin', require('./routes/admin/courses'));     
app.use('/api/admin', require('./routes/admin/drop-course'));   
app.use('/api/admin', require('./routes/admin/pending-users'));       
app.use('/api/admin', require('./routes/admin/verify'));   
app.use('/api/admin', require('./routes/admin/send-notice-with-file'));   
app.use('/api/admin', require('./routes/admin/assign-teacher'));   
app.use('/api/admin', require('./routes/admin/add-session'));   
app.use('/api/admin', require('./routes/admin/add-fee'));   
app.use('/api/admin', require('./routes/admin/approve-payment'));   
app.use('/api/admin', require('./routes/admin/pending-payments'));   
app.use('/api/admin', require('./routes/admin/view-pending-requests'));   
app.use('/api/admin', require('./routes/admin/view-responded-requests'));   
app.use('/api/admin', require('./routes/admin/reply-request'));   
app.use('/api/admin', require('./routes/admin/publish-result'));   

//app.use('/api/admin/pending-teachers', require('./routes/admin/pending-users'));    


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

