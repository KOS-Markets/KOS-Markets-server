import Router from '@koa/router';

import { userService } from '../service/user.js'

export const userRouter = new Router({ prefix: '/user' });

// 获取当前用户信息接口
userRouter.get('/getSelfInfo', async function (ctx) {
    const uid = ctx.token_payload.data.uid;
    const result = await userService.getSelfInfo(uid);
    ctx.body = result;
});