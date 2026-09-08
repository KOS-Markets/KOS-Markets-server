import { verifyJwtToken } from '../tools/token.js';

// 验证用户令牌的中间件
export default async function checkUserToken(ctx, next) {
    let token = ctx.headers.authorization;
    if (!token) {
        return ctx.body = { code: 401, msg: 'token is null', data: null };
    }
    try {
        ctx.token_payload = await verifyJwtToken(token);
        await next();
    } catch (err) {
        return ctx.body = { code: 401, msg: err.message, data: null };
    }
}
