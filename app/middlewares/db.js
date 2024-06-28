const mysql = require('mysql2/promise');
const config = require('../config/db.config.js');

const env = process.env.NODE_ENV || 'prod';
const dbConfig = config[env];

const createConnection = async () => {
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

const verifyDb = async (req, res, next) => {
    try {
        if (!req.connection.state || req.connection.state === 'disconnected')
            req.connection = await createConnection();

        next();
    } catch (error) {
        console.error('Error verifying the database connection:', error);
        res.status(500).send('Database connection error');
    }
}

const dbConnect = {
    verifyDb: verifyDb
};

module.exports = dbConnect;