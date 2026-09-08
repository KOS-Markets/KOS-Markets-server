CREATE DATABASE kos_db DEFAULT CHARACTER SET 'utf8mb4' COLLATE utf8mb4_unicode_ci;
USE kos_db;

-- 用户表
CREATE TABLE kos_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '使用BIGINT类型作为主键 并自动递增',
    username VARCHAR(150) NOT NULL UNIQUE COMMENT '用户名 非空唯一约束',
    password VARCHAR(255) NOT NULL COMMENT '密码字段 sha256加密存储',
    email VARCHAR(150) NOT NULL UNIQUE COMMENT '邮箱地址 非空唯一约束',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 语言类型表
CREATE TABLE kos_language_type (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '使用BIGINT类型作为主键 并自动递增',
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '类型名 非空唯一约束',
    description VARCHAR(50) DEFAULT NULL COMMENT 'description'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 公告表
CREATE TABLE kos_notice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '使用BIGINT类型作为主键 并自动递增',
    languageTypeId BIGINT DEFAULT NULL COMMENT '语言类型 关联到 kos_language_type 表',
    title VARCHAR(255) NOT NULL COMMENT '文章标题',
    content longtext NOT NULL COMMENT '富文本内容 (HTML格式)',
    weight int(11) NOT NULL DEFAULT 0 COMMENT '权重 (数值越大排序越靠前)',
    create_time datetime DEFAULT CURRENT_TIMESTAMP COMMENT '自定义创建时间 (用户可选择，默认可设为当前时间)',
    update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间 (系统自动维护)',
    is_del tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标志 (0-未删除, 1-已删除)',
    INDEX idx_languageTypeId_isdel (languageTypeId, is_del),
    INDEX idx_weight_isdel (weight, is_del)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;