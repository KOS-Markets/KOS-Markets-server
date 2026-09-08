import Router from '@koa/router';
import multer from '@koa/multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

import { noticeService } from '../service/notice.js'
import { notice_all_language } from '../config/base.js';

// 解决 ES Module 中的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- 配置 multer ----------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ✅ 你的静态资源目录：项目根目录下的 /public/photo
        // 注意：notice.js 在 router/ 下，所以用 ../ 回到根目录
        const uploadDir = path.join(__dirname, '../public/photo');
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // ✅ 使用 crypto.randomUUID() 生成唯一文件名
        const ext = path.extname(file.originalname);
        const newName = randomUUID() + ext;
        cb(null, newName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 限制 2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('仅支持图片文件'), false);
        }
    }
});

export const noticeRouter = new Router({ prefix: '/notice' });

noticeRouter.post('/upload-img', upload.single('file'), async function (ctx) {
    try {
        const file = ctx.file;
        if (!file) {
            ctx.body = { errno: 1, message: '未收到文件' };
            return;
        }

        // ✅ 访问路径为 /photo/xxx.jpg（对应 public/photo 目录）
        const url = `/photo/${file.filename}`;

        // 返回 wangEditor V5 要求的格式
        ctx.body = {
            errno: 0,
            data: [url]
        };
    } catch (err) {
        console.error('上传图片出错:', err);
        ctx.body = {
            errno: 1,
            message: err.message || '服务器内部错误'
        };
    }
});

noticeRouter.post('/upload-notice', async function (ctx) {
    const language = ctx.request.body?.language;
    if (!(notice_all_language.includes(language))) {
        ctx.body = {
            code: 400,
            msg: 'language not found',
            data: null
        };
        return ;
    }
    const title = ctx.request.body?.title;
    const content = ctx.request.body?.content;
    if (!title || !content) {
        ctx.body = {
            code: 400,
            msg: 'title and content not null',
            data: null
        };
        return ;
    }
    const weight = ctx.request.body?.weight;
    if (isNaN(parseInt(weight))) {
        ctx.body = {
            code: 400,
            msg: 'weight not null',
            data: null
        };
        return ;
    }
    const create_time = ctx.request.body?.create_time;
    const result = await noticeService.uploadNotice(language, title, content, create_time, weight);
    ctx.body = result;
});

noticeRouter.post('/del-notice', async function (ctx) {
    // 1. 获取参数
    const notice_list = ctx.request.body?.notice_list;

    // 2. 校验：是否存在
    if (!notice_list) {
        ctx.body = {
            code: 400,
            msg: 'notice_list is required',
            data: null
        };
        return;
    }

    // 3. 校验：必须是数组
    if (!Array.isArray(notice_list)) {
        ctx.body = {
            code: 400,
            msg: 'notice_list must be an array',
            data: null
        };
        return;
    }

    // 4. 校验：数组不能为空
    if (notice_list.length === 0) {
        ctx.body = {
            code: 400,
            msg: 'notice_list cannot be empty',
            data: null
        };
        return;
    }

    // 5. 校验：数组元素必须全部是整数（且大于0，因为id是BIGINT自增）
    const isValid = notice_list.every(id => Number.isInteger(id) && id > 0);
    if (!isValid) {
        ctx.body = {
            code: 400,
            msg: 'notice_list must contain positive integers only',
            data: null
        };
        return;
    }

    // 6. 所有校验通过，调用 Service 层（待实现）
    const result = await noticeService.delNotice(notice_list);
    ctx.body = result;
});