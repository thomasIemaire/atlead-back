const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

global.__basedir = __dirname;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRouter = require('./app/routes/authentification.route');
const userRouter = require('./app/routes/user.route');
const postRouter = require('./app/routes/post.route');

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Atlead's API!" });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/authentification/', authRouter);
app.use('/api/user/', userRouter);
app.use('/api/post/', postRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}/`);
});