import { Express } from "express";
import RUOYU from "../ruoyu";
export default (app: Express) => {
    app.locals = {
        RUOYU: {},
        cssList: [], // 占位，防止报错
        jsList: [], // 占位，防止报错
        cdnUrl: RUOYU.cdnUrl,
        dayjs: RUOYU.dayjs,
    };
};
