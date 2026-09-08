import Mysql80 from '../library/mysql80.js';
import { config } from '../config/index.js';

export const mysql = new Mysql80({
    host: config.mysql_config.host,
    port: config.mysql_config.port,
    user: config.mysql_config.user,
    pswd: config.mysql_config.pswd,
    database: config.mysql_config.db,
});

