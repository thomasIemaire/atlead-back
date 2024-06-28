const express = require('express');
const router = express.Router();
const config = require("../config/authentification.config");
const db = require("../middlewares/db");
const authentification = require("../middlewares/authentification");
const authentificationService = require('../services/authentification.service');
var jwt = require("jsonwebtoken");

router.get('/', [authentification.verifyToken], async (req, res, next) => {
    try {
        res.status(200).send({ rowid: req.rowid, identifiant: req.identifiant });
    } catch (err) {
        next(err);
    }
});

router.get('/refresh', [authentification.verifyToken], async (req, res, next) => {
    try {
        let accessToken = jwt.sign({
            rowid: req.rowid,
            identifiant: req.identifiant,
        }, config.secret, { expiresIn: config.jwtExpiration });

        res.status(200).send({ token: accessToken, user: { rowid: req.rowid, identifiant: req.identifiant } });
    } catch (err) {
        next(err);
    }
});

router.post('/signin', [db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { identifiant, password } = req.body;
        let user = await authentificationService.getUserByCredentials(identifiant, password, connection);

        if (!user)
            res.status(404).send({ message: "Nom d'utilisateur ou mot de passe invalide!" });
        else {
            let accessToken = jwt.sign({
                rowid: user.rowid,
                identifiant: user.identifiant,
            }, config.secret, { expiresIn: config.jwtExpiration });

            res.status(200).send({ token: accessToken, user });
        }
    } catch (err) {
        next(err)
    }
});

router.post('/signup', [db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { identifiant, username, email, password } = req.body;
        let user = await authentificationService.setUserByCredentials(identifiant, username, email, password, connection);

        if (!user) res.status(404).send({ message: "Votre compte n'a pas pu être créé!" });
        else {
            let accessToken = jwt.sign({
                rowid: user.rowid,
                identifiant: user.identifiant,
            }, config.secret, { expiresIn: config.jwtExpiration });

            res.status(200).send({ token: accessToken, user });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;