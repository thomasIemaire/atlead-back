const express = require('express');
const router = express.Router();
const db = require("../middlewares/db");
const authentification = require("../middlewares/authentification");
const userService = require("../services/user.service");

router.post('/', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { username } = req.body;
        let users = await userService.searchUsersByUsername(req.rowid, username, connection);

        if (!users) res.status(404).send({ message: "Aucun compte n'a été trouvé!" });
        else res.status(200).send({ users });
    } catch (err) {
        next(err);
    }
});

router.get('/:identifiant', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        let account = await userService.getUserByIdentifiant(req.rowid, req.params.identifiant, connection);

        if (!account) res.status(404).send({ message: "Le compte n'est pas accessible!" });
        else res.status(200).send({ account });
    } catch (err) {
        next(err);
    }
});

router.post('/subscribe', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { rowidTo } = req.body;
        let message = await userService.userSubscribe(req.rowid, rowidTo, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

router.post('/unsubscribe', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { rowidTo } = req.body;
        let message = await userService.userUnsubscribe(req.rowid, rowidTo, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

module.exports = router;