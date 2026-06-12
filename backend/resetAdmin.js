const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function run() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bakery_bliss'
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [result] = await connection.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [hashedPassword, 'admin@bakery.com']
    );

    console.log('Reset Admin Password Status:', result);
    await connection.end();
}

run().catch(console.error);
