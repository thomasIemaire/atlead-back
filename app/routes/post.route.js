const express = require('express');
const router = express.Router();
const authentification = require("../middlewares/authentification");
const postService = require('../services/post.service');

router.get('/advice', [authentification.verifyToken], async (req, res, next) => {
    try {
        const connection = req.app.locals.db;
        const advices = await postService.getAllAdvices(req.rowid, connection);

        if (!advices) res.status(404).send({ message: 'Aucun conseil trouvé!' });
        res.status(200).send({ advices });
    } catch (err) {
        next(err);
    }
});

router.get('/advice/:identifiant', [authentification.verifyToken], async (req, res, next) => {
    try {
        const connection = req.app.locals.db;
        const identifiant = req.params.identifiant;
        const advices = await postService.getUserAdvices(req.rowid, identifiant, connection);

        if (!advices) res.status(404).send({ message: 'Aucun conseil trouvé!' });
        res.status(200).send({ advices });
    } catch (err) {
        next(err);
    }
});

router.post('/advice', [authentification.verifyToken], async (req, res, next) => {
    try {
        const connection = req.app.locals.db;
        const { advice } = req.body;
        const datetime = new Date();
        const message = await postService.setAdvice(req.rowid, advice, datetime, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

router.post('/advice/like', [authentification.verifyToken], async (req, res, next) => {
    try {
        const connection = req.app.locals.db;
        const { idAdvice } = req.body;
        const message = await postService.setLikeOnAdvice(req.rowid, idAdvice, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

router.post('/advice/unlike', [authentification.verifyToken], async (req, res, next) => {
    try {
        const connection = req.app.locals.db;
        const { idAdvice } = req.body;
        const message = await postService.removeLikeOnAdvice(req.rowid, idAdvice, connection);

        if (!message.success) res.status(404).send({ message });
        else res.status(200).send({ message });
    } catch (err) {
        next(err);
    }
});

module.exports = router;