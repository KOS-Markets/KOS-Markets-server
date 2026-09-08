import { noticeDao } from '../dao/notice.js';

export const noticeService = {
    async uploadNotice(language, title, content, create_time, weight) {
        try {
            const result = await noticeDao.addNotice(language, title, content, create_time, weight);
            const insertId = result[0].insertId;
            if (!insertId) {
                return { code: 500, msg: 'server err', data: null };
            } else {
                return { code: 200, msg: 'add notice OK', data: { id: insertId } };
            }
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    },
    async delNotice(notice_list) {
        try {
            const result = await noticeDao.delNotice(notice_list);
            return {
                code: 200,
                msg: 'delete success',
                data: null
            };
        } catch (err) {
            console.log(err);
            return { code: 500, msg: 'server err', data: null };
        }
    }
};