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
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
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

//teacher
app.use('/api/teacher',require('./routes/teacher/view-enrollment-requests'));
app.use('/api/teacher',require('./routes/teacher/approve-enrollment'));

//admin
app.use('/api/admin', require('./routes/admin/add-course'));     
app.use('/api/admin', require('./routes/admin/add-student'));     
app.use('/api/admin', require('./routes/admin/add-teacher'));     
app.use('/api/admin', require('./routes/admin/courses'));     
app.use('/api/admin', require('./routes/admin/drop-course'));   
app.use('/api/admin', require('./routes/admin/pending-users'));       
app.use('/api/admin', require('./routes/admin/verify'));     

//app.use('/api/admin/pending-teachers', require('./routes/admin/pending-users'));    


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

