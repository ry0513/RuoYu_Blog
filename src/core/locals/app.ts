import { Express } from "Express";
import RUOYU from "../ruoyu";
export default (app: Express) => {
    app.locals = {
        RUOYU: { title: "RUOYU" },
        jsList: RUOYU.jsList,
        cssList: RUOYU.cssList,
        account: RUOYU.account,
    };
};
