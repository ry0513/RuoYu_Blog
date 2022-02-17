import sequelize from "./sequelize";
import RUOYU from "../core/ruoyu";

(async () => {
    RUOYU.info("MYSQL 模块: 准备初始化");
    await sequelize.sync({ force: false, alter: true });

    RUOYU.info("MYSQL 模块: 结束初始化");
})();
