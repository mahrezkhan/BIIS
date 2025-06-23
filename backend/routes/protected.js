const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.user_type} with ID ${req.user.login_id}` });
});

module.exports = router;
