const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create database and tables if not exists
const initDatabase = async () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
        if (err) throw err;
        console.log('Database ensured');
        
        connection.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) throw err;
            
            const createInvoicesTable = `
                CREATE TABLE IF NOT EXISTS invoices (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    bill_no VARCHAR(50) NOT NULL UNIQUE,
                    customer_name VARCHAR(100) NOT NULL,
                    bill_date DATE NOT NULL,
                    phone_no VARCHAR(20) NOT NULL,
                    total_amount DECIMAL(10,2) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            
            const createItemsTable = `
                CREATE TABLE IF NOT EXISTS invoice_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    invoice_id INT NOT NULL,
                    item_name VARCHAR(100) NOT NULL,
                    rate DECIMAL(10,2) NOT NULL,
                    quantity INT NOT NULL,
                    gst DECIMAL(5,2) NOT NULL,
                    amount DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
                )
            `;
            
            connection.query(createInvoicesTable, (err) => {
                if (err) throw err;
                console.log('Invoices table ensured');
            });
            
            connection.query(createItemsTable, (err) => {
                if (err) throw err;
                console.log('Invoice items table ensured');
            });
            
            connection.end();
        });
    });
};

initDatabase();

module.exports = pool.promise();