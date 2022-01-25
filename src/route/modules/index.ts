import { Router } from "express";
import RUOYU from "../../core/ruoyu";
import Locals from "../../core/locals/user";
import { getArticleCount, getArticleList } from "../../db/api/article";
import { toPInt } from "../../core/tools";

const router = Router();

router.use(async (req, res, next) => {
    Locals(req, res);
    next();
});

router.get("/", async (req, res, next) => {
    const page = toPInt(req.query.page, 1);
    const limit = toPInt(req.query.limit, 10);
    if (page && limit) {
        let param: { userId?: number; status?: number } = {};
        const articleList = await getArticleList(param, (page - 1) * limit, limit);
        const articleCount = await getArticleCount({});
        res.locals = { ...res.locals, page: "home/index", articleList, articleCount, cssList: RUOYU.getCssList("web/index", "web/home") };
        res.render("layout/web");
    }
});

export default router;
