import { Router } from "express";
import { needLogin } from "../../core/permission";
const router = Router();

router.get("/", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = {
            ...res.locals,
            page: "console/tag/list",
            user: req.session.blog,
            jsList: ["js/console/tag/list"],
        };
        res.render("layout/console");
    });
});

router.get("/my", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = {
            ...res.locals,
            page: "console/tag/my",
            user: req.session.blog,
            jsList: ["js/console/tag/my"],
        };
        res.render("layout/console");
    });
});

export default router;
