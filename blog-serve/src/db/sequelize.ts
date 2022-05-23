import { Sequelize } from "sequelize-typescript";
import { DB } from "../config/global";

import RUOYU from "../config/ruoyu";

const sequelize = new Sequelize(DB.BASE, DB.USER, DB.PASSWD, {
    host: DB.HOST,
    dialect: "mysql",
    timezone: "+08:00",
    pool: {
        max: 20,
        min: 0,
        idle: 10000,
    },
    logging: false,
    define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        underscored: true,
    },
    models: [RUOYU.path(__dirname, "./modles/")],
});

// 测试数据库能否正常使用
(async () => {
    sequelize
        .authenticate()
        .then(() => {
            RUOYU.logInfo("MYSQL 模块: 连接正常");
            RUOYU.logInfo("MYSQL 模块: 更新格式");
            sequelize.sync({ force: false, alter: true });
            RUOYU.logInfo("MYSQL 模块: 更新格式结束");
        })
        .catch((err) => {
            RUOYU.logError("MYSQL 模块: 连接异常", err);
        });
})();

export default sequelize;
