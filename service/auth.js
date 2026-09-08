import { userDao } from '../dao/user.js';

import { createUserJwtToken } from '../tools/token.js';

export const authService = {
    async login(account, password) {
        try {
            const result = await userDao.getUserByEmail(account);
            if (result[0].length == 0) {
                return { code: 400, msg: 'account not found', data: null };
            }
            const user = result[0][0];
            if (user.password == password) {
                let payload = { uid: user.id };
                let jwt = await createUserJwtToken(payload, { expiresIn: '24h' });
                return { code: 200, msg: 'login success', data: { token: jwt, userinfo: {
                    id: user.id,
                    username: user.username,
                } } };
            } else {
                return { code: 400, msg: 'account or password incorrect' };
            }
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    }
};