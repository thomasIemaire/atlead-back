async function getUserByIdentifiant(rowid, identifiant, connection) {
    try {
        const [rows] = await connection.execute(
            `SELECT rowid, identifiant, username, 
             COUNT(DISTINCT Subscriber.from) AS subscriber, 
             COUNT(DISTINCT Subscription.to) AS subscription
             FROM atl_user
             LEFT JOIN atl_subscriber AS Subscriber
             ON Subscriber.to = atl_user.rowid
             LEFT JOIN atl_subscriber AS Subscription
             ON Subscription.from = atl_user.rowid
             WHERE atl_user.identifiant = ?
             GROUP BY identifiant, username;`,
            [identifiant]
        );

        if (rows.lenght === 0) return null;

        const [subscription] = await connection.execute(
            `SELECT COUNT(*) > 0 AS isSubscribed
             FROM atl_subscriber AS sub
             WHERE sub.from = ? AND sub.to = ?`,
            [rowid, rows[0].rowid]
        );

        const account = {
            rowid: rows[0].rowid,
            identifiant: rows[0].identifiant,
            username: rows[0].username,
            subscriber: rows[0].subscriber,
            subscription: rows[0].subscription,
            isSubscribed: subscription[0].isSubscribed === 1
        };

        return account;
    } catch (error) {
        throw new Error("Erreur lors de la recherche de l'utilisateur par son identifiant : " + error.message);
    }
}

async function searchUsersByUsername(rowid, username, connection) {
    try {
        const [rows] = await connection.execute(
            `SELECT identifiant, username
             FROM atl_user
             WHERE username LIKE CONCAT('%', ?, '%') AND rowid != ?
             ORDER BY username ASC;`,
            [username, rowid]
        );

        if (rows.lenght === 0) return null;
        return rows;
    } catch (error) {
        throw new Error("Erreur lors de la recherche des utilisateurs : " + error.message);
    }
}

async function userSubscribe(rowidFrom, rowidTo, connection) {
    try {
        const [result] = await connection.execute(
            'INSERT INTO `atl_subscriber` (`from`, `to`) VALUES (?, ?)',
            [rowidFrom, rowidTo]
        );

        if (result.affectedRows === 0) return { success: false, message: 'Aucune ligne insérée' };
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de l'insertion de la souscription : " + error.message);
    }
}

async function userUnsubscribe(rowidFrom, rowidTo, connection) {
    try {
        const [result] = await connection.execute(
            'DELETE FROM `atl_subscriber` WHERE `from` = ? AND `to` = ? ',
            [rowidFrom, rowidTo]
        );

        if (result.affectedRows === 0) return { success: false, message: 'Aucune ligne supprimée' };
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la recherche des utilisateurs : " + error.message);
    }
}

module.exports = {
    getUserByIdentifiant,
    searchUsersByUsername,
    userSubscribe,
    userUnsubscribe
}