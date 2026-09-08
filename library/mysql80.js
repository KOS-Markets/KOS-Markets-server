/**
 * @依赖 npm i mysql2
 * @功能点
 *     - 数据库连接设置为 连接池 并 支持心跳包
 *     - 对外暴露 Mysql80类 提供以下方法
 *         1. sqlExec                普通执行sql语句并关闭连接
 *         2. sqlExecInTransaction   在事务环境下执行sql语句不关闭连接
 *         3. startTransaction       开始事务
 *         4. commitTransaction      提交事务
 *         5. rollbackTransaction    回滚事务
 * @注意 本驱动只对 mysql2库 进行再封装 读取数据库连接信息的操作应开发者自行解决
 */

import mysql from 'mysql2/promise';

export default class Mysql80 {
    constructor(config) {
        // 数据库连接对象
        this.db = null;
        // 数据库连接信息
        this.host = config.host;
        this.port = config.port;
        this.user = config.user;
        this.pswd = config.pswd;
        this.database = config.database;
        // 数据库心跳包间隔时间 默认3分钟
        this.heartbeat = config.heartbeat ?? 3 * 60 * 1000;
    }

    /*-------------------------------- 初始化 --------------------------------*/
    async init() {
        if (this.db) return;
        // 输出连接信息
        console.log('正在连接 mysql 数据库...', this.host, this.port);
        // 连接数据库
        this.db = mysql.createPool({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.pswd,
            database: this.database,
            charset: 'utf8mb4',
            // mysql2 常用连接池选项
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true,
            // 支持心跳
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
        // 检测数据库是否连接成功
        try {
            const conn = await this.db.getConnection();
            console.log('mysql2 连接成功！线程 id:', conn.threadId);
            conn.release();
            this.startTimerCheckConnection();
        } catch (err) {
            console.error(`mysql数据库连接失败 ! ! ! !`);
            console.error(` -> host: ${this.host}`);
            console.error(` -> port: ${this.port}`);
            console.error(` -> user: ${this.user}`);
            console.error(` -> password: ${this.pswd}`);
            console.error(` -> database: ${this.database}`);
            reject("mysql数据库连接失败 ! ! ! !");
            process.exit(1);
        }
    }

    /*-------------------------------- 心跳 --------------------------------*/
    startTimerCheckConnection() {
        setInterval(() => this.checkConnection(), this.heartbeat);
    }

    async checkConnection() {
        try {
            const conn = await this.db.getConnection();
            await conn.ping();
            conn.release();
            console.log('mysql2 心跳正常');
        } catch (err) {
            console.error('mysql2 心跳失败:', err);
        }
    }

    /*-------------------------------- 基本查询 --------------------------------*/
    // 单步执行sql的方法
    sqlExec(sql, data) {
        return this.db.execute(sql, data);
    }

    // 释放连接池中单个连接的方法
    // releaseConnection(connection) {
    //     // 连接判空
    //     if (!connection) {
    //         throw new Error('connection is null');
    //     }
    //     // 尝试释放连接，报错表示重复释放，直接返回即可
    //     try {
    //         connection.release();
    //     } catch (err) {
    //         return ;
    //     }
    // }

    /*-------------------------------- 事务相关 --------------------------------*/
    // 开启事务的方法
    async startTransaction() {
        const conn = await this.db.getConnection();
        await conn.beginTransaction();
        return {
            success: true,
            connection: conn,
            isRollback: false,
            isClose: false,
            isCommit: false
        };
    }

    // 事务环境下的单步执行的方法
    async sqlExecInTransaction({ connection }, sql, data) {
        const [rows] = await connection.execute(sql, data);
        return rows;
    }
    /*
     * 提交事务的方法
     */
    async commitTransaction(connObj) {
        const { connection } = connObj;
        if (connObj.isCommit || connObj.isClose || connObj.isRollback) return;
        try {
            await connection.commit();
        } finally {
            connObj.isCommit = connObj.isClose = true;
            connection.release();
        }
    }

    /*
     * 回滚事务的方法
     */
    async rollbackTransaction(connObj) {
        const { connection } = connObj;
        if (connObj.isCommit || connObj.isClose || connObj.isRollback) return;
        try {
            await connection.rollback();
        } finally {
            connObj.isRollback = connObj.isClose = true;
            connection.release();
        }
    }
}
