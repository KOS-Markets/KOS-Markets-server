import Router from '@koa/router';

import { publicService } from '../service/public.js'
import { notice_all_language } from '../config/base.js';

export const publicRouter = new Router({ prefix: '/public' });

// 客户端获取公告接口 分页接口
publicRouter.get('/getNoticeList', async function (ctx) {
    let page = parseInt(ctx.query?.page) || 1;
    let size = parseInt(ctx.query?.size) || 10;
    const language = ctx.query?.language;
    const order_by_weight = ctx.query?.order_by_weight;
    if (isNaN(page)) page = 1;
    if (isNaN(size)) size = 10;
    if (size > 50) size = 50;
    if (language && !(notice_all_language.includes(language))) {
        ctx.body = {
            code: 400,
            msg: 'language not found',
            data: null
        };
        return ;
    }
    if (order_by_weight && !(['asc', 'desc'].includes(order_by_weight))) {
        ctx.body = {
            code: 400,
            msg: 'order by rule not found',
            data: null
        };
        return ;
    }
    const result = await publicService.getNoticeList(page, size, language, order_by_weight);
    ctx.body = result;
});

// 获取公告详情接口
publicRouter.get('/getNoticeDetail', async function (ctx) {
    const id = ctx.query?.id;
    const result = await publicService.getNoticeDetail(id);
    ctx.body = result;
});