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
    const res = await client.query('SELECT role, count(*) FROM users GROUP BY role');
    console.log('Role counts:');
    console.table(res.rows);
    
    const res2 = await client.query('SELECT email, role FROM users');
    console.log('User roles:');
    console.table(res2.rows);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

checkUsers();
