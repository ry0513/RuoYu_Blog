import { Router } from "express";
import { needLogin } from "../../core/permission";
import RUOYU from "../../core/ruoyu";
import Locals from "../../core/locals/user";
import { getArticle, getArticleTags, getArticleSorts, getArticleSortCount } from "../../db/api/article";
import { toPInt } from "../../core/tools";

const router = Router();

router.use(async (req, res, next) => {
    Locals(req, res);
    next();
});

router.get("/?:articleId", async (req, res, next) => {
    const articleId = toPInt(req.params.articleId);
    if (articleId) {
        const article = await getArticle({ articleId });
        res.locals = { ...res.locals, page: "article/index", article, cssList: RUOYU.getCssList("prism/prism", "article/details", "web/index") };
        res.render("layout/web");
        return;
    }
    next();
    // res.send(req.params);
    // needLogin(10, req, res, () => {
    //     res.locals = { ...res.locals, page: "user/index", user: req.session.userData, cssList: RUOYU.getCssList("user/index") };
    //     res.render("layout/user");
    // });
});

export default router;
