import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const default_jwtKey = '4a65s4da4dgf5frg5s5s41f58a4wsf5dfv56s54d'
import { config } from '../config/index.js';

export const jwtKey = config.jwtKey || default_jwtKey;

export function sha256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * verifyJwtToken
 * @param { string } token 需要验证的token
 * @description 验证 token 的函数
 */
export function verifyJwtToken(token) {
    // 异步转同步 强制立即执行jwt的解码操作
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtKey, (err, decoded) => {
            if (err) {
                reject({ err: 'token验证不通过' });
            } else if (parseInt(+new Date() / 1000) >= decoded.exp) {
                reject({ err: 'token已过期' });
            } else {
                resolve({ data: decoded });
            }
        });
    });
}

/**
 * createUserJwtToken
 * @param { object } data 提供用户登录状态的非敏感数据
 * @param { object } exp 提供过期时间: exp = { expiresIn: '168h' }
 * @description 生成 token 的函数
 */
export async function createUserJwtToken(data, exp) {
    let token = jwt.sign(data, jwtKey, exp);
    return token;
}
