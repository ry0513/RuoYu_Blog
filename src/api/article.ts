import { Router } from "express";
import { needVerify } from "../core/permission";
import RUOYU from "../core/ruoyu";
import { toPInt, toString, toArray, formatCode } from "../core/tools";
import {
    addArticle,
    addTagArticle,
    changeArticleStatus,
    delTagArticle,
    getArticle,
    getArticleCount,
    getArticleList,
    getArticleSortCount,
    setArticle,
} from "../db/api/article";
import { getTag } from "../db/api/tag";
const router = Router();

// 列表
router.get("/list", (req, res) => {
    needVerify(10, req, res, async () => {
        const page = toPInt(req.query.page, 1);
        const limit = toPInt(req.query.limit, 10);
        const status = toArray(req.query.status);
        if (page && limit) {
            const param = { userId: req.session.blog.userId, status: status || [0, 1, 2] };
            const data = await getArticleList(param, (page - 1) * limit, limit);
            const count = await getArticleCount(param);
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
        const content = toArray(req.body.content);
        const status = toString(req.body.status);
        if (title && html && content) {
            if (status === "draft") {
                const { articleId } = await addArticle({
                    userId: req.session.blog.userId,
                    title,
                    html,
                    content,
                });
                RUOYU.res.success(res, { articleId, msg: "保存成功" });
                return;
            } else if (status === "release") {
                const sortId = toPInt(req.body.sortId);
                const images = toArray(req.body.images);
                const password = toString(req.body.password, "");
                const tags = toArray(req.body.tags, []);
                if (sortId && images && password !== false && tags) {
                    const status = req.session.blog.status > 20 ? 2 : 1;
                    const { articleId } = await addArticle({
                        userId: req.session.blog.userId,
                        title,
                        html,
                        content,
                        sortId,
                        images,
                        password,
                        status,
                    });
                    tags.forEach(async (tagId) => {
                        (await getTag(tagId)) && (await addTagArticle({ tagId, articleId }));
                    });
                    RUOYU.res.success(res, { msg: "保存成功, 跳转中..." });
                    return;
                }
            }
        }
        RUOYU.res.parameter(res);
    });
});

// 修改
router.put("/", (req, res) => {
    needVerify(20, req, res, async () => {
        const title = toString(req.body.title);
        let html = toString(req.body.html);
        const content = toArray(req.body.content);
        const articleId = toPInt(req.body.articleId);
        const status = toString(req.body.status);
        if (articleId && title && html && content) {
            html = formatCode(html);
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
                    const status = req.session.blog.status >= 30 ? 2 : 1;
                    await setArticle({
                        articleId,
                        title,
                        html,
                        content,
                        sortId,
                        images,
                        password,
                        status,
                    });
                    await delTagArticle(articleId);
                    tags.forEach(async (tagId) => {
                        (await getTag(tagId)) && (await addTagArticle({ tagId, articleId }));
                    });
                    RUOYU.res.success(res, { msg: "保存成功, 跳转中..." });
                    return;
                }
            }
        }
        RUOYU.res.parameter(res);
    });
});

// 获取
router.get("/", (req, res) => {
    needVerify(20, req, res, async () => {
        const articleId = toPInt(req.query.articleId);
        if (articleId) {
            const article = await getArticle({ articleId, userId: req.session.blog.userId });
            if (article) {
                RUOYU.res.success(res, { article });
                return;
            }
        }
        RUOYU.res.parameter(res);
    });
});

// 修改状态
router.put("/statusChange", (req, res) => {
    needVerify(20, req, res, async () => {
        const articleId = toPInt(req.body.articleId);
        const status = toPInt(req.body.status);
        if (articleId && status !== false && [0, 3].includes(status)) {
            const [changeRows] = await changeArticleStatus(
                articleId,
                req.session.blog.userId,
                status
            );
            if (changeRows === 1) {
                const count = await getArticleSortCount(req.session.blog.userId);
                RUOYU.res.success(res, { count });
            } else {
                RUOYU.res.error(res);
            }
            return;
        }
        RUOYU.res.parameter(res);
    });
});
// 文章密码
router.post("/password", async (req, res) => {
    const password = toString(req.body.password);
    const articleId = toPInt(req.body.articleId);
    if (password && articleId) {
        const article = await getArticle({ articleId });
        if (password === article?.password) {
            if (req.session.blog) {
                req.session.blog.articlePass[`article_${articleId}`] = password;
            } else {
                RUOYU.setCookie(res, `article_${articleId}`, password);
            }
            RUOYU.res.success(res);
            return;
        }
        RUOYU.res.error(res, { msg: "密码不正确" });
        return;
    }
    RUOYU.res.parameter(res);
});
export default router;
