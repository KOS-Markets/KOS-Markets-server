import { noticeDao } from '../dao/notice.js';

export const publicService = {
    async getNoticeList(page, size, language, order_by_weight) {
        try {
            const result = await noticeDao.getNoticeList(page, size, language, order_by_weight);
            return { code: 200, msg: 'get notice list OK', data: result };
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    },
    async getNoticeDetail(id) {
        try {
            const result = await noticeDao.getNoticeDetail(id);
            if (result[0].length == 0) {
                return { code: 400, msg: 'this notice not found', data: null };
            }
            return { code: 200, msg: 'get notice detail OK', data: result[0][0] || null };
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    }
};