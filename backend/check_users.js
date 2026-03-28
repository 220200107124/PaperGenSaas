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
    const res = await client.query('SELECT id, email, role, "schoolId" FROM users');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

checkUsers();
