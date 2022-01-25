import { Router } from "express";
import fs from "fs-extra";
import RUOYU from "../core/ruoyu";
const router = Router();

// 装载所有路由;
const routeList = fs.readdirSync(RUOYU.path(__dirname, "./modules"));
for (const key of routeList) {
    import(RUOYU.path(__dirname, "./modules/", key)).then((item) => {
        const route = key.split(".")[0] === "index" ? "" : key.split(".")[0];
        router.use(`/${route}`, item.default);
    });
}

export default router;
