import { Router } from "express";
import RUOYU from "../core/ruoyu";
import { toPInt } from "../core/tools";
import { getArticle } from "../db/api/article";

const router = Router();

router.get("/?:articleId", async (req, res, next) => {
    const articleId = toPInt(req.params.articleId);
    if (articleId) {
        const article = await getArticle({ articleId });
        if (article) {
            let password: string | undefined = RUOYU.getCookie(req, `article_${article.articleId}`);
            if (req.session.blog && password === undefined) {
                password = req.session.blog.articlePass[`article_${article.articleId}`];
            }
            if (
                article.userId === req.session.blog?.userId ||
                (article.status === 1 && req.session?.blog?.status === 1000) ||
                (article.status === 2 && (!article.password || article.password === password))
            ) {
                res.locals = {
                    ...res.locals,
                    showType: 1,
                    page: "article",
                    article,
                    cssList: ["css/article", "plugin/prism/prism"],
                };
                res.render("layout/web");
                return;
            } else if (article.status === 2) {
                res.locals = {
                    ...res.locals,
                    showType: 2,
                    page: "article",
                    articleId: article.articleId,
                    jsList: ["js/article/password"],
                };
                res.render("layout/web");
                return;
            }
        }
    }
    next();
});

export default router;
