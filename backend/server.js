const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./db/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Server is working');
});

// Routes
app.use('/api/auth', require('./routes/auth'));       // signup, signin
app.use('/api/admin', require('./routes/admin'));     // verify, pending users
app.use('/api', require('./routes/protected'));      // JWT-protected demo route
const studentRoutes = require('./routes/student');
app.use('/api/student', studentRoutes);              // student-specific info


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

