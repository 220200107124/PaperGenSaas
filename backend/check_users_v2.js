const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'paper_saas',
  });

  try {
    await client.connect();
    const res = await client.query('SELECT id, email, role, "schoolId" FROM users ORDER BY email');
    res.rows.forEach(user => {
        console.log(`Email: ${user.email.padEnd(25)} | Role: ${user.role.padEnd(15)} | SchoolId: ${user.schoolId}`);
    });
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

checkUsers();
