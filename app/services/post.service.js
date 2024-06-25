async function getAllAdvices(rowid, connection) {
    try {
        const [advices] = await connection.execute(
            `SELECT p.rowid, p.\`user\`, u.identifiant, u.username, p.advice, p.datetime, COUNT(l.advice) AS like_count, IF(ul.\`user\` IS NOT NULL, TRUE, FALSE) AS user_liked
            FROM atl_advice_post p
            LEFT JOIN atl_user u ON u.rowid = p.user
            LEFT JOIN atl_advice_like l ON p.rowid = l.advice
            LEFT JOIN (SELECT advice, \`user\` FROM atl_advice_like WHERE \`user\` = ?) ul ON p.rowid = ul.advice
            GROUP BY p.rowid, p.\`user\`, p.advice, p.datetime
            ORDER BY p.datetime DESC;`,
            [rowid]
        );

        if (advices.lenght === 0) return null;
        return advices;
    } catch (error) {
        throw new Error("Erreur lors de la recherche des conseils : " + error.message);
    }
}

async function getUserAdvices(rowid, identifiant, connection) {
    try {
        const [advices] = await connection.execute(
            `SELECT p.rowid, p.\`user\`, u.identifiant, u.username, p.advice, p.datetime, COUNT(l.advice) AS like_count, IF(ul.\`user\` IS NOT NULL, TRUE, FALSE) AS user_liked
            FROM atl_advice_post p
            LEFT JOIN atl_user u ON u.rowid = p.user
            LEFT JOIN atl_advice_like l ON p.rowid = l.advice
            LEFT JOIN (SELECT advice, \`user\` FROM atl_advice_like WHERE \`user\` = ?) ul ON p.rowid = ul.advice
            WHERE u.identifiant = ?
            GROUP BY p.rowid, p.\`user\`, p.advice, p.datetime
            ORDER BY p.datetime DESC;`,
            [rowid, identifiant]
        );

        if (advices.lenght === 0) return null;
        return advices;
    } catch (error) {
        throw new Error("Erreur lors de la recherche des conseils : " + error.message);
    }
}

async function setAdvice(rowid, advice, datetime, connection) {
    try {
        const [result] = await connection.execute(
            `INSERT INTO atl_advice_post (\`user\`, advice, datetime) VALUES (?, ?, ?)`,
            [rowid, advice, datetime]
        );

        if (result.affectedRows === 0) return { success: false, message: 'Aucune ligne insérée' };
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de l'insertion d'un nouveau conseil : " + error.message);
    }
}

async function setLikeOnAdvice(rowid, idAdvice, connection) {
    try {
        const [result] = await connection.execute(
            `INSERT INTO atl_advice_like (advice, \`user\`) VALUES (?, ?)`,
            [idAdvice, rowid]
        );

        if (result.affectedRows === 0) return { success: false, message: 'Aucune ligne insérée' };
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de l'insertion d'un nouveau conseil : " + error.message);
    }
}

async function removeLikeOnAdvice(rowid, idAdvice, connection) {
    try {
        const [result] = await connection.execute(
            'DELETE FROM atl_advice_like WHERE advice = ? AND `user` = ? ',
            [idAdvice, rowid]
        );

        if (result.affectedRows === 0) return { success: false, message: 'Aucune ligne supprimée' };
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la recherche des utilisateurs : " + error.message);
    }
}

module.exports = {
    getAllAdvices,
    getUserAdvices,
    setAdvice,
    setLikeOnAdvice,
    removeLikeOnAdvice
}