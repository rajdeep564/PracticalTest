const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '123456';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);

  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Validation test:', isValid);

  // Generate SQL update statements
  console.log('\nSQL Update Statements:');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@gmail.com';`);
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'user@gmail.com';`);
}

generateHash().catch(console.error);
