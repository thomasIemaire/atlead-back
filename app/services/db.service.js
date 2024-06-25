const mysql = require('mysql2/promise');
const config = require('../config/db.config.js');

const env = process.env.NODE_ENV || 'dev';
const dbConfig = config[env];

async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });
        console.log(`Connected to the ${env} database.`);
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = {
    createConnection
};