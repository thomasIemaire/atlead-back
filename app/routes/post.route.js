const express = require('express');
const router = express.Router();
const db = require("../middlewares/db");
const authentification = require("../middlewares/authentification");
const postService = require('../services/post.service');

router.get('/advice', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const advices = await postService.getAllAdvices(req.rowid, connection);

        if (!advices) res.status(404).send({ message: 'Aucun conseil trouvé!' });
        res.status(200).send({ advices });
    } catch (err) {
        next(err);
    }
});

router.get('/advice/:identifiant', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const identifiant = req.params.identifiant;
        const advices = await postService.getUserAdvices(req.rowid, identifiant, connection);

        if (!advices) res.status(404).send({ message: 'Aucun conseil trouvé!' });
        res.status(200).send({ advices });
    } catch (err) {
        next(err);
    }
});

router.post('/advice', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { advice } = req.body;
        const datetime = new Date();
        const message = await postService.setAdvice(req.rowid, advice, datetime, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

router.post('/advice/like', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { idAdvice } = req.body;
        const message = await postService.setLikeOnAdvice(req.rowid, idAdvice, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

router.post('/advice/unlike', [authentification.verifyToken, db.verifyDb], async (req, res, next) => {
    try {
        const connection = req.connection;
        const { idAdvice } = req.body;
        const message = await postService.removeLikeOnAdvice(req.rowid, idAdvice, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

module.exports = router;