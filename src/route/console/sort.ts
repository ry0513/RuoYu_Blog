import { Router } from "express";
import { needLogin } from "../../core/permission";
import { getArticleSortCount } from "../../db/api/article";
const router = Router();

router.get("/", (req, res) => {
    needLogin(10, req, res, async () => {
        const count = await getArticleSortCount(req.session.blog.userId);
        res.locals = {
            ...res.locals,
            page: "console/sort/list",
            user: req.session.blog,
            count,
            jsList: ["js/console/sort/list"],
        };
        res.render("layout/console");
    });
});

router.get("/my", (req, res) => {
    needLogin(10, req, res, async () => {
        const count = await getArticleSortCount(req.session.blog.userId);
        res.locals = {
            ...res.locals,
            page: "console/sort/my",
            user: req.session.blog,
            count,
            jsList: ["js/console/sort/my"],
        };
        res.render("layout/console");
    });
});

export default router;
