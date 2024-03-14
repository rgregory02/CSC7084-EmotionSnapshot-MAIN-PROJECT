const mysql = require('mysql2');
const db = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});



//host: 'localhost',
//user: 'root',
//password: 'root',
//database: 'CSC7084ASSIGNMENT',
//port: '8889'

// });

db.connect((err) => {
    if (err) {
        throw err;
    }

    console.log(`Database connection successful!`);
});

module.exports = db;