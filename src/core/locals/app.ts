import { Express } from "Express";
import dayjs from "dayjs";
import RUOYU from "../ruoyu";
export default (app: Express) => {
    app.locals = {
        RUOYU: { title: "RUOYU" },
        jsList: RUOYU.jsList,
        cssList: RUOYU.cssList,
        account: RUOYU.account,
        dayjs: (date: Date, format: string = "YYYY-MM-DD HH:mm:ss") => {
            return dayjs(date).format(format);
        },
    };
};
