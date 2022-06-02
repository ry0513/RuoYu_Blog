import { Router } from "express";
import fs from "fs-extra";
import RUOYU from "../config/ruoyu";
const router = Router();
router.use(({ method, originalUrl, session: { account } }, res, next) => {
    if (["POST"].includes(method) || originalUrl.includes("/user/")) {
        if (account) {
            next();
        } else {
            if (originalUrl === "/api/user/userInfo") {
                RUOYU.resSuccess(res, { account: { accountId: 0 }, route: [] });
                return;
            }
            RUOYU.resNeedLogin(res, { msg: "需要登录" });
        }
    } else {
        next();
    }
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

const a = "ss";
const aa = [1, 2, 3];
