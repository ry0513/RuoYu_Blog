import { Express } from "express";
import RUOYU from "../ruoyu";
export default (app: Express) => {
    app.locals = {
        websiteTitle: "若",
        websiteDescription: "description",
        websiteKeywords: "keyword",
        accountUrl: RUOYU.accountUrl,
        RUOYU: {
            title: "若",
            description: "description",
        },
        cssList: [], // 占位，防止报错
        jsList: [], // 占位，防止报错
        cdnUrl: RUOYU.cdnUrl,
        version: RUOYU.version,
        dayjs: (date: Date, format = "YYYY-MM-DD HH:mm:ss") => {
            return RUOYU.dayjs(date).format(format);
        },
    };
};
