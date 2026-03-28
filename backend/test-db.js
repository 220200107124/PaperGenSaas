
import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'root',
    database: 'paper_saas',
  });

  try {
    await client.connect();
    console.log('Connected to Postgres');
    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('Tables:', res.rows.map(r => r.table_name));
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.stack);
  }
}

testConnection();
