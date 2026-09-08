import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { config } from './config/index.js';

import { authRouter } from './router/auth.js';
import { publicRouter } from './router/public.js';
import { userRouter } from './router/user.js';
import { noticeRouter } from './router/notice.js';

import { cors } from './middleware/cors.js';
import checkUserToken from './middleware/checkUserToken.js';

import { mysql } from './db/mysql80.js';

mysql.init();

// 实例化服务器
const app = new Koa();

// 应用中间件
app.use(cors());
app.use(bodyParser({
    jsonLimit: '20mb',  // json请求体大小
    formLimit: '20mb',  // form表单大小
    textLimit: '20mb',  // 纯文本请求大小
}));

// 挂载静态资源目录
app.use(serve(path.join(__dirname, 'public')));

app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());
app.use(checkUserToken);
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(noticeRouter.routes()).use(noticeRouter.allowedMethods());

// 开启服务器
const PORT = config.base_config.port;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});