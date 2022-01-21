import { Router } from "express";
import { needVerify } from "../../core/permission";
import RUOYU from "../../core/ruoyu";
import { toPInt, toString, toArray } from "../../core/tools";
import { addArticle, addTagArticle, delTagArticle, getArticleCount, getArticleList, setArticle } from "../../db/api/article";

const router = Router();

// 列表
router.get("/list", (req, res) => {
    needVerify(10, req, res, async () => {
        const page = toPInt(req.query.page, 1);
        const limit = toPInt(req.query.limit, 10);
        if (page && limit) {
            const data = await getArticleList({ userId: req.session.userData.userId }, (page - 1) * limit, limit);
            const count = await getArticleCount({ userId: req.session.userData.userId });
            RUOYU.res.success(res, { count, data });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 新增
router.post("/", (req, res) => {
    needVerify(20, req, res, async () => {
        const title = toString(req.body.title);
        const html = toString(req.body.html);
        const content = toString(req.body.content);
        const status = toString(req.body.status);
        if (title && html && content) {
            if (status === "draft") {
                const { articleId } = await addArticle({ userId: req.session.userData.userId, title, html, content });
                RUOYU.res.success(res, { articleId, msg: "保存成功" });
                return;
            } else if (status === "release") {
                const sortId = toPInt(req.body.sortId);
                const images = toArray(req.body.images);
                const password = toString(req.body.password, "");
                const tags = toArray(req.body.tags, []);
                if (sortId && images && password !== false && tags) {
                    const status = req.session.userData.userStatus > 20 ? 2 : 1;
                    const { articleId } = await addArticle({ userId: req.session.userData.userId, title, html, content, sortId, images, password, status });
                    tags.forEach(async (tagId) => {
                        await addTagArticle({ tagId, articleId });
                    });
                    RUOYU.res.success(res, { articleId, msg: "保存成功, 跳转中..." });
                    return;
                }
            }
        }
        RUOYU.res.parameter(res);
    });
});

// 修改
router.post("/set", (req, res) => {
    needVerify(20, req, res, async () => {
        const title = toString(req.body.title);
        const html = toString(req.body.html);
        const content = toString(req.body.content);
        const articleId = toPInt(req.body.articleId);
        const status = toString(req.body.status);
        if (articleId && title && html && content) {
            if (status === "draft") {
                await setArticle({ articleId, title, html, content });
                RUOYU.res.success(res, { articleId, msg: "保存成功" });
                return;
            } else if (status === "release") {
                const sortId = toPInt(req.body.sortId);
                const images = toArray(req.body.images);
                const password = toString(req.body.password, "");
                const tags = toArray(req.body.tags, []);
                if (sortId && images && password !== false && tags) {
                    const status = req.session.userData.userStatus >= 30 ? 2 : 1;
                    await setArticle({ articleId, title, html, content, sortId, images, password, status });
                    await delTagArticle(articleId);
                    tags.forEach((tagId) => {
                        addTagArticle({ tagId, articleId });
                    });
                    RUOYU.res.success(res, { articleId, msg: "保存成功, 跳转中..." });
                    return;
                }
            }
        }
        RUOYU.res.parameter(res);
    });
});

export default router;
