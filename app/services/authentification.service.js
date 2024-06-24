const bcrypt = require("bcrypt");

async function getUserByCredentials(identifiant, password, connection) {
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM atl_user WHERE identifiant = ?',
            [identifiant]
        );

        if (rows.lenght === 0) return null;

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return null;
        return user;

    } catch (error) {
        throw new Error("Erreur lors de la recherche de l'utilisateur par ses identifiants : " + error.message);
    }
}

async function setUserByCredentials(identifiant, username, email, password, connection) {
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await connection.execute(
            'INSERT INTO atl_user (identifiant, username, email, password) VALUES (?, ?, ?, ?)',
            [identifiant, username, email, hashedPassword]
        );

        const [rows] = await connection.execute(
            'SELECT * FROM atl_user WHERE rowid = ?',
            [result.insertId]
        );

        if (rows.length === 0) return null;
        return rows[0];
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    getUserByCredentials,
    setUserByCredentials,
}