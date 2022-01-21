import { Router } from "express";
import fs from "fs-extra";
import RUOYU from "../core/ruoyu";
const router = Router();

// 装载所有路由;
const routeList = fs.readdirSync(RUOYU.path(__dirname, "./modules"));
for (const key of routeList) {
    import(RUOYU.path(__dirname, "./modules/", key)).then((item) => {
        router.use(`/${key.split(".")[0]}`, item.default);
    });
}

export default router;
