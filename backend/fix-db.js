const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'paper_saas',
});

async function run() {
  await client.connect();
  try {
    console.log('Updating user roles from ADMIN to SCHOOL_ADMIN...');
    // We update the column to text first to allow any value, then update the values,
    // and let TypeORM handle the final enum conversion during its sync.
    // However, the error happens DURING TypeORM sync.
    // If we just change the data to something that WILL be in the new enum, it might work if TypeORM's 'USING' clause matches.
    
    // Let's see if we can just update the column to 'SCHOOL_ADMIN' in the current enum (if it still exists).
    // The error says "invalid input value for enum users_role_enum: "ADMIN"". 
    // This means the NEW enum 'users_role_enum' already exists (TypeORM created it as RENAME TO ...old and then CREATE TYPE ...).
    
    // TypeORM's sequence:
    // 1. ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"
    // 2. CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER')
    // 3. ALTER TABLE ... USING "role"::"text"::"public"."users_role_enum"
    
    // Step 3 fails.
    
    // If I can't catch it between step 2 and 3, I should just fix the data.
    // But the data is in a column that is still of type "users_role_enum_old".
    
    // Best approach:
    // 1. Change the column type to TEXT temporarily.
    // 2. Update 'ADMIN' to 'SCHOOL_ADMIN'.
    // 3. Let TypeORM do the rest.
    
    console.log('Checking current roles...');
    const res = await client.query('SELECT DISTINCT role FROM users');
    console.log('Current roles:', res.rows);

    await client.query('ALTER TABLE "users" ALTER COLUMN "role" TYPE text');
    await client.query("UPDATE users SET role = 'SCHOOL_ADMIN' WHERE role = 'ADMIN'");
    console.log('Roles updated.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
