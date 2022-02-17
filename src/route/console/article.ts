import { Router } from "express";
import { needLogin } from "../../core/permission";
import { toPInt } from "../../core/tools";
import { getArticleSortCount, getArticle } from "../../db/api/article";
import { getSorts } from "../../db/api/sort";
import { getTags } from "../../db/api/tag";
const router = Router();

router.get("/", (req, res) => {
    needLogin(10, req, res, async () => {
        const count = await getArticleSortCount(req.session.blog.userId);
        res.locals = {
            ...res.locals,
            page: "console/article/list",
            user: req.session.blog,
            count,
            jsList: ["js/console/article/list"],
        };
        res.render("layout/console");
    });
});

router.get("/edit", (req, res) => {
    needLogin(20, req, res, async () => {
        const articleId = toPInt(req.query.article);
        let article: object | null = { tags: [] };
        if (articleId) {
            article = await getArticle({ articleId, userId: req.session.blog.userId });
            if (!article) {
                res.redirect("/console/article/edit");
                return;
            }
        }
        const tags = await getTags();
        const sorts = await getSorts();
        const getChecked = (tag: number, tags: Array<{ tagId: number }>) => {
            return tags
                .map((item) => {
                    return item.tagId;
                })
                .indexOf(tag) > -1
                ? "checked"
                : "";
        };
        res.locals = {
            ...res.locals,
            tags,
            sorts,
            article,
            getChecked,
            page: "console/article/edit",
            user: req.session.blog,
            cssList: ["plugin/wangeditor/style", "css/console/index", "css/console/edit"],
            jsList: [
                "plugin/wangeditor/index",
                "plugin/localforage/localforage",
                "js/console/article/edit",
            ],
        };
        res.render("layout/default");
    });
});

export default router;
