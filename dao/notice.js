import { mysql } from '../db/mysql80.js';

export const noticeDao = {
    async addNotice(language, title, content, create_time, weight) {
        let sql, data = [ language, title, content, weight ];
        const getLanguageTypeIdSql = `( select id from kos_language_type where name = ? LIMIT 1)`;
        if (create_time) {
            sql = `INSERT INTO kos_notice(
                    languageTypeId,
                    title,
                    content,
                    weight,
                    create_time
                ) VALUES (${ getLanguageTypeIdSql }, ?, ?, ?, FROM_UNIXTIME(? / 1000))`;
            data.push(create_time);
        } else {
            sql = `INSERT INTO kos_notice(
                    languageTypeId,
                    title,
                    content,
                    weight
                ) VALUES (${ getLanguageTypeIdSql }, ?, ?, ?)`;
        }
        return mysql.sqlExec(sql, data);
    },
    async getNoticeList(page, size, language, order_by_weight) {
        // 基础条件：未删除
        let whereClause = 'WHERE n.is_del = 0';
        const params = [];
        if (language) {
            whereClause += ' AND lt.name = ?';
            params.push(language);
        }
        // 查询总数
        let countSql = `SELECT COUNT(*) AS total FROM kos_notice n LEFT JOIN kos_language_type lt ON n.languageTypeId = lt.id ${whereClause}`;
        const countResult = await mysql.sqlExec(countSql, params);
        const total = countResult[0][0]?.total || 0;

        // 排序
        let orderClause = 'ORDER BY n.create_time DESC'; // 默认按创建时间降序
        if (order_by_weight) {
            const direction = order_by_weight.toUpperCase(); // 'ASC' or 'DESC'
            orderClause = `ORDER BY n.weight ${direction}, n.create_time DESC`;
        }

        // 分页
        const offset = (page - 1) * size;
        const dataSql = `SELECT
                n.id as id,
                n.title as title,
                n.content as content,
                n.weight as weight,
                UNIX_TIMESTAMP(n.create_time) * 1000 as create_time,
                UNIX_TIMESTAMP(n.update_time) * 1000 as update_time,
                lt.name as language_name
            FROM kos_notice n
            LEFT JOIN kos_language_type lt ON n.languageTypeId = lt.id
            ${ whereClause }
            ${ orderClause }
            LIMIT ? OFFSET ?`;
        const dataParams = [...params, size, offset];
        const list = await mysql.sqlExec(dataSql, dataParams);

        return { list: list[0], total };
    },
    async delNotice(notice_list) {
        // 防御性校验：如果数组为空，直接返回，避免 SQL 报错
        if (!notice_list || notice_list.length === 0) {
            return { affectedRows: 0 };
        }

        // 动态生成占位符，如 '?,?,?'
        const placeholders = notice_list.map(() => '?').join(',');
        const sql = `UPDATE kos_notice SET is_del = 1 WHERE id IN (${placeholders})`;
        
        // 执行更新，notice_list 作为参数数组
        return mysql.sqlExec(sql, notice_list);
    },
    async getNoticeDetail(id) {
        const sql = `
            SELECT
                n.id as id,
                n.title as title,
                n.content as content,
                n.weight as weight,
                UNIX_TIMESTAMP(n.create_time) * 1000 as create_time,
                UNIX_TIMESTAMP(n.update_time) * 1000 as update_time,
                lt.name as language_name
            FROM kos_notice n
            LEFT JOIN kos_language_type lt ON n.languageTypeId = lt.id
            WHERE n.id = ?
            LIMIT 1
        `;
        const data = [ id ];
        return mysql.sqlExec(sql, data);
    }
};