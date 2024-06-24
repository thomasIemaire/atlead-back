const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./app/services/db.service');

global.__basedir = __dirname;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRouter = require('./app/routes/authentification.route');
const userRouter = require('./app/routes/user.route');

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Atlead's API!" });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/authentification/', authRouter);
app.use('/api/user/', userRouter);

const PORT = 3000;

async function startServer() {
    try {
        const connection = await db.createConnection();
        
        app.locals.db = connection;

        app.listen(PORT, () => {
            console.log(`Server is running on: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();