import sequelize from "./sequelize";
// import { Sequelize, DataTypes } from "sequelize";
// import User from "./modles/User";
// import Tag from "./modles/Tag";
// import Article from "./modles/Article";
// import TagArticle from "./modles/TagArticle";

(async () => {
    await sequelize.sync({ force: true, alter: true });

    // Tag.findOne({
    //     where: {
    //         tagId: 1,
    //     },
    //     include: [
    //         {
    //             model: User,
    //         },
    //     ],
    // }).then((tag) => {
    //     console.log(tag?.user.nickName );
    // });
    console.log("初始化完成");
})();
