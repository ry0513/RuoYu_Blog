import { Router } from "express";
import { needLogin } from "../../core/permission";
import RUOYU from "../../core/ruoyu";
import Locals from "../../core/locals/user";
import { getArticle, getArticleTags, getArticleSorts } from "../../db/api/article";
import { toPInt } from "../../core/tools";

const router = Router();

router.use(async (req, res, next) => {
    Locals(req, res);
    next();
});

router.get("/", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = { ...res.locals, page: "user/index", user: req.session.userData, cssList: RUOYU.getCssList("user/index") };
        res.render("layout/user");
    });
});

router.get("/article", (req, res) => {
    needLogin(20, req, res, () => {
        res.locals = { ...res.locals, page: "user/article/list", user: req.session.userData, cssList: RUOYU.getCssList("user/index"), jsList: RUOYU.getJsList("user/article/list") };
        res.render("layout/user");
    });
});

router.get("/article/edit", (req, res) => {
    needLogin(20, req, res, async () => {
        const articleId = toPInt(req.query.article);
        let article: {} | null = { tags: [] };
        if (articleId) {
            article = await getArticle({ articleId, userId: req.session.userData.userId });
            if (!article) {
                res.redirect("/user/article/edit");
                return;
            }
        }
        const tags = await getArticleTags();
        const sorts = await getArticleSorts();
        const getChecked = (tag: number, tags: Array<{ tagId: number }>) => {
            return tags
                .map((item: any) => {
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
            page: "user/article/edit",
            user: req.session.userData,
            cssList: RUOYU.getCssList("user/index", "user/article/edit", "wangeditor/style"),
            jsList: RUOYU.getJsList("wangeditor/index", "user/article/edit"),
        };
        res.render("layout/default");
    });
});

router.get("/tag", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = { ...res.locals, page: "user/tag/list", user: req.session.userData, cssList: RUOYU.getCssList("user/index"), jsList: RUOYU.getJsList("user/tag/list") };
        res.render("layout/user");
    });
});

router.get("/tag/my", (req, res) => {
    needLogin(40, req, res, () => {
        res.locals = { ...res.locals, page: "user/tag/my", user: req.session.userData, cssList: RUOYU.getCssList("user/index"), jsList: RUOYU.getJsList("user/tag/my") };
        res.render("layout/user");
    });
});
export default router;
