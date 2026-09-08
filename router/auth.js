import Router from '@koa/router';

import { authService } from '../service/auth.js'

export const authRouter = new Router({ prefix: '/auth' });

authRouter.post('/login', async function (ctx) {
    const account = ctx.request.body?.account;
    const password = ctx.request.body?.password;
    if (!account || !password) {
        ctx.body = {
            code: 400,
            msg: 'account and password not null',
            data: null
        };
        return ;
    }
    const result = await authService.login(account, password);
    ctx.body = result;
});