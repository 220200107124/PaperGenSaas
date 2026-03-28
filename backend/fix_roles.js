const { Client } = require('pg');

async function fixRoles() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'paper_saas',
  });

  try {
    await client.connect();
    
    // Fix Admin
    await client.query("UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'admin@papergen.com'");
    console.log('Admin role fixed');

    // Fix School Admin
    await client.query("UPDATE users SET role = 'SCHOOL_ADMIN' WHERE email = 'school@papergen.com'");
    console.log('School Admin role fixed');

    // Fix Teacher (ensure they have schoolId if possible, or leave as is)
    // Actually, demo teacher should have a schoolId.
    
    const res = await client.query('SELECT email, role, "schoolId" FROM users');
    console.table(res.rows);

  } catch (err) {
    console.error('Error fixing roles:', err);
  } finally {
    await client.end();
  }
}

fixRoles();
