import { Router } from "express";
import fs from "fs-extra";
import RUOYU from "../core/ruoyu";
import { toPInt } from "../core/tools";
import { getArticleCount, getArticleList } from "../db/api/article";
const router = Router();

router.get("/", async (req, res) => {
    const page = toPInt(req.query.page, 1);
    const limit = toPInt(req.query.limit, 10);
    if (page && limit) {
        const param = { status: [2] };
        const articleList = await getArticleList(param, (page - 1) * limit, limit);
        const articleCount = await getArticleCount(param);
        res.locals = {
            ...res.locals,
            page: "index",
            articleList,
            articleCount,
        };
        res.render("layout/web");
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
