const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

const password = 'open2405050';

// Use async/await to properly handle the async bcrypt.hash
async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword); // This will log the hashed password
}

hashPassword();
