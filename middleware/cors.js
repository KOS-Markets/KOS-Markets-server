// /**
//  * Koa CORS 中间件
//  * @param { Object }           options                 配置项
//  * @param { string | Array }   options.origin        - 允许的源，默认 '*'，可传 'https://example.com' 或 ['http://a.com','http://b.com']
//  * @param { string | Array }   options.methods       - 允许的 HTTP 方法，默认 'GET,HEAD,PUT,POST,DELETE,PATCH'
//  * @param { string | Array }   options.headers       - 允许的请求头，默认 'Content-Type,Authorization'
//  * @param { boolean }          options.credentials   - 是否允许携带凭证（cookie），默认 false
//  * @param { number }           options.maxAge        - 预检缓存时间（秒），默认 86400（24小时）
//  */
// function cors(options = {}) {
//     const {
//         origin = '*',
//         // methods = 'GET,HEAD,PUT,POST,DELETE,PATCH',
//         // headers = 'Content-Type,Authorization',
//         methods = '*',
//         headers = '*',
//         credentials = false,
//         maxAge = 86400,
//     } = options;

//     // 将 methods 和 headers 统一转成字符串，方便设置
//     const allowMethods = Array.isArray(methods) ? methods.join(',') : methods;
//     const allowHeaders = Array.isArray(headers) ? headers.join(',') : headers;

//     return async function corsMiddleware(ctx, next) {
//         // 1. 获取请求中的 Origin 头
//         const requestOrigin = ctx.get('Origin');

//         // 2. 确定允许的源（如果 origin 是数组则动态匹配，否则直接使用配置值）
//         let allowOrigin = origin;
//         if (Array.isArray(origin)) {
//             // 如果请求的 Origin 在列表中，就返回它，否则不返回（或返回第一个？通常应返回匹配的）
//             allowOrigin = origin.includes(requestOrigin) ? requestOrigin : '';
//         } else if (origin === '*') {
//             allowOrigin = '*';
//         } else if (origin && requestOrigin) {
//             // 如果配置了具体的域名，且请求携带了 Origin，则直接使用该配置（或进行比较？）
//             // 通常简单处理：配置的 origin 为具体域名时，直接使用它（但需要与请求 Origin 一致才安全）
//             // 这里采用更严谨的方式：仅当配置的域名与请求 Origin 完全匹配时才允许
//             allowOrigin = (origin === requestOrigin) ? requestOrigin : '';
//         }

//         // 如果最终 allowOrigin 为空，则拒绝跨域（不设置任何头，或设置空？）
//         // 但为了友好，我们可以放行但只设置空，让浏览器不通过。
//         if (!allowOrigin) {
//             // 不设置任何 CORS 头，相当于不允许，直接执行后续业务（可能会被浏览器拦截）
//             await next();
//             return;
//         }

//         // 3. 设置响应头（对所有请求都设置）
//         ctx.set('Access-Control-Allow-Origin', allowOrigin);

//         if (credentials) {
//             // 注意：当 credentials 为 true 时，Origin 不能为 '*'
//             if (allowOrigin === '*') {
//                 // 建议抛出错误或警告，但这里我们自动转为具体的 Origin（如果请求有Origin的话）
//                 if (requestOrigin) {
//                     ctx.set('Access-Control-Allow-Origin', requestOrigin);
//                     ctx.set('Access-Control-Allow-Credentials', 'true');
//                 } else {
//                     // 没有 Origin，无法处理，忽略
//                 }
//             } else {
//                 ctx.set('Access-Control-Allow-Credentials', 'true');
//             }
//         }

//         // 4. 处理预检请求（OPTIONS）
//         if (ctx.method === 'OPTIONS') {
//             // 设置预检相关的头
//             ctx.set('Access-Control-Allow-Methods', allowMethods);
//             ctx.set('Access-Control-Allow-Headers', allowHeaders);
//             ctx.set('Access-Control-Max-Age', String(maxAge));

//             // 返回 204 No Content（也可以返回 200，但 204 更标准）
//             ctx.status = 204;
//             // 不调用 next，终止请求链
//             return;
//         }

//         // 5. 非预检请求，继续执行后续中间件
//         await next();

//         // 注意：有些响应头（如 Access-Control-Expose-Headers）如果需要暴露给前端，可以在这里追加
//         // ctx.set('Access-Control-Expose-Headers', 'X-Custom-Header');
//     };
// }

// export default cors;

export function cors() {
    return async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', '*');
        ctx.set('Access-Control-Allow-Headers', '*');
        if (ctx.method === 'OPTIONS') {
            ctx.status = 204;
            return;
        }
        await next();
    };
}