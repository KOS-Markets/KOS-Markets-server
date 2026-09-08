import { userDao } from '../dao/user.js';

export const userService = {
    async login(account, password) {
        try {
            const result = await userDao.getUserByEmail(account);
            if (result[0].length == 0) {
                return { code: 400, msg: 'account not found', data: null };
            }
            const user = result[0][0];
            if (user.password == password) {
                return { code: 200, msg: 'login success', data: { token: '123' } };
            } else {
                return { code: 400, msg: 'account or password incorrect' };
            }
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    },
    async getSelfInfo(uid) {
        try {
            const result = await userDao.getUserById(uid);
            if (result[0].length == 0) {
                return { code: 400, msg: 'this user not found', data: null };
            }
            const user = result[0][0];
            return { code: 200, msg: 'login success', data: user };
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    }
};