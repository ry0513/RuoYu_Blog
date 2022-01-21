import { Router } from "express";
import fs from "fs-extra";
import RUOYU from "../core/ruoyu";
const router = Router();

const apiList = fs.readdirSync(RUOYU.path(__dirname, "./modules"));
for (const key of apiList) {
    import(RUOYU.path(__dirname, "./modules/", key)).then((item) => {
        router.use("/" + key.split(".")[0], item.default);
    });
}

export default router;
