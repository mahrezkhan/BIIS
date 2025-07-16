const bcrypt = require('bcrypt');
const password = 'open123001'; // This is the admin's raw password
const saltRounds = 10;

// Hash the password
bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed Password:', hashedPassword);
    // Now you can insert the hashed password into the database
  }
});
