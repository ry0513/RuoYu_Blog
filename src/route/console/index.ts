import { Router } from "express";
import fs from "fs-extra";
import { needLogin } from "../../core/permission";
import RUOYU from "../../core/ruoyu";

import Locals from "../../core/locals/console";
const router = Router();

router.use((req, res, next) => {
    Locals(req, res);
    next();
});

router.get("/", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = {
            ...res.locals,
            page: "console/index",
            user: req.session.blog,
        };
        res.render("layout/console");
    });
});

// 装载子路由;
const routeList = fs.readdirSync(RUOYU.path(__dirname)).filter((item) => {
    return item !== "index.js";
});
for (const key of routeList) {
    if (fs.statSync(RUOYU.path(__dirname, key)).isDirectory()) {
        import(RUOYU.path(__dirname, key, "./index")).then((item) => {
            router.use(`/${key}`, item.default);
        });
    } else {
        import(RUOYU.path(__dirname, key)).then((item) => {
            router.use(`/${key.split(".")[0]}`, item.default);
        });
    }
}

export default router;
