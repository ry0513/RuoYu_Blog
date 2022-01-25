import sequelize from "./sequelize";
// import { Sequelize, DataTypes } from "sequelize";
// import User from "./modles/User";
// import Tag from "./modles/Tag";
import Article from "./modles/Article";
import { Sequelize } from "sequelize-typescript";
// import TagArticle from "./modles/TagArticle";

(async () => {
    await sequelize.sync({ force: false, alter: true });

    const res = await Article.findAll({
        group: "status",
        attributes: ["status", [Sequelize.fn("COUNT", Sequelize.col("status")), "n_hats"]],
    });
    console.log(res[0].getDataValue("n_hats"));
    const obj: number[] = [];
    res.forEach((item, index) => {
        obj[item.status] = item.getDataValue("n_hats");
    });
    console.log(obj);

    console.log("初始化完成");
})();
