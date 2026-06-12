const mysql = require('mysql2/promise');

async function run() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bakery_bliss'
    });

    const [rows] = await connection.execute('SELECT id, name, email, role, phone FROM users');
    console.log('--- USERS IN DATABASE ---');
    console.log(rows);
    await connection.end();
}

run().catch(console.error);
