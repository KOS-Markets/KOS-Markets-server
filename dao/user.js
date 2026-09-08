import { mysql } from '../db/mysql80.js';

export const userDao = {
    async getUserByEmail(email) {
        const sql = `
            SELECT
                id,
                username,
                password
            FROM kos_user
            WHERE email = ?
            LIMIT 1`;
        const data = [ email ];
        return mysql.sqlExec(sql, data);
    },
    async getUserById(uid) {
        const sql = `
            SELECT
                username,
                email
            FROM kos_user
            WHERE id = ?
            LIMIT 1`;
        const data = [ uid ];
        return mysql.sqlExec(sql, data);
    }
};