import { Router, Request } from "express";
import RUOYU from "../config/ruoyu";
import { body, param, query, validationResult } from "express-validator";
import { front, toNumArr } from "../config/validator";
import { formatCode } from "../utils/tools";
import { addTagArticle, createArticle, delTagArticleByArticleId, getArticle, getArticleList, isArticle, updateArticle } from "../db/api/article";
import { isTag } from "../db/api/tag";
import { currentPage, toArr, toLike } from "../config/validator";
import { STATUS_ARTICLE } from "../config/status";
import { isSort } from "../db/api/sort";

const router = Router();

// 编辑时API
// 获取全部
router.get(
    "/control/list",
    query("current").default(1).isInt({ min: 1, allow_leading_zeroes: false }).toInt().customSanitizer(currentPage),
    query("pageSize").default(10).isInt({ min: 1, allow_leading_zeroes: false }).toInt(),

    query("status")
        .default(-1)
        .toInt()
        .isIn([...STATUS_ARTICLE, -1])
        .customSanitizer(toArr),
    query("sortId").default(-1).isInt().toInt().customSanitizer(toArr),

    query("content").default("").isString().customSanitizer(toLike),
    async (req: Request<{}, {}, {}, RequestGet>, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { current, pageSize, status, content, sortId } = req.query;

        const where = { status, content, sortId };
        const data = await getArticleList({
            where,
            current: current * pageSize,
            pageSize,
        });
        RUOYU.resSuccess(res, data);
    }
);

// 获取指定Id文章(编辑时回显)
router.get("/control/:articleId", param("articleId").isInt({ min: 1 }).toInt(), async (req: Request<{ articleId: number }, {}, {}, {}>, res) => {
    if (!validationResult(req).isEmpty()) {
        return RUOYU.resParameter(res);
    }
    const { articleId } = req.params;
    const userId = req.session.account.accountId;
    const article = await getArticle({ articleId, userId });
    if (article) {
        RUOYU.resSuccess(res, { article });
    } else {
        RUOYU.resError(res, { msg: "文章不存在或不属于你" });
    }
});

// 新增
router.post(
    "/",
    body("status").isIn([0, 1]).toInt(),
    body("title").isString().isLength({ min: 5, max: 50 }),
    body("html").isString(),
    body("content").isString(),
    body("password").default("").isString(),
    body("sortId")
        .if(front("body", "status", [1]))
        .isInt()
        .toInt(),
    body("type")
        .if(front("body", "status", [1]))
        .isIn([0, 1, 2, 3])
        .toInt(),
    body("tags")
        .default([])
        .if(front("body", "status", [1]))
        .isArray()
        .customSanitizer(toNumArr),
    // body("image")
    //     .if(front("body", "status", [1]))
    //     .isArray()
    //     .custom((value: number[], { req }) => {
    //         return value.length === req.body.type;
    //     })
    //     .customSanitizer(toNumArr),

    // ,
    async (req, res) => {
        console.log(req.body.content);

        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res, { err: validationResult(req).array() });
        }
        const { status, title, html, content, password, sortId, type, tags } = req.body;
        const userId = req.session.account.accountId;
        if (!(await isSort(sortId))) {
            return RUOYU.resError(res, { msg: "分类不存在" });
        }

        if (status === 0) {
            const { articleId } = await createArticle({ status, title, html, content, userId });
            RUOYU.resSuccess(res, { articleId });
        } else {
            const { articleId } = await createArticle({ status, title, html, content, userId, password, sortId, type });
            tags.forEach(async (tagId: number) => {
                (await isTag({ tagId })) && (await addTagArticle({ tagId, articleId }));
            });
            RUOYU.resSuccess(res, { articleId });
        }
    }
);

// 编辑
// updateArticle
router.put(
    "/",
    body("articleId").isInt({ min: 1, allow_leading_zeroes: false }).toInt(),
    body("status").isIn([0, 1]).toInt(),
    body("title").isString().isLength({ min: 5, max: 50 }),
    body("html").isString(),
    body("content").isString(),
    body("password").default("").isString(),
    body("sortId")
        .if(front("body", "status", [1]))
        .isInt()
        .toInt(),
    body("type")
        .if(front("body", "status", [1]))
        .isIn([0, 1, 2, 3])
        .toInt(),
    body("tags")
        .if(front("body", "status", [1]))
        .isArray()
        .customSanitizer(toNumArr),
    // body("image")
    //     .if(front("body", "status", [1]))
    //     .isArray()
    //     .custom((value: number[], { req }) => {
    //         return value.length === req.body.type;
    //     })
    //     .customSanitizer(toNumArr),

    // ,
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { articleId, status, title, html, content, password, sortId, type, tags } = req.body;
        const userId = req.session.account.accountId;
        if (!(await isSort(sortId))) {
            return RUOYU.resError(res, { msg: "分类不存在" });
        }
        if (!(await isArticle({ articleId, userId }))) {
            return RUOYU.resError(res, { msg: "文章不存在或不属于你" });
        }

        if (status === 0) {
            console.log("草稿");
            console.log(await isArticle({ articleId, userId }));
            await updateArticle({ articleId, status, title, html, content });
            RUOYU.resSuccess(res, { articleId });
        } else {
            await delTagArticleByArticleId(articleId);
            await updateArticle({ articleId, status, title, html, content, password, sortId, type });
            tags.forEach(async (tagId: number) => {
                (await isTag({ tagId })) && (await addTagArticle({ tagId, articleId }));
            });
            RUOYU.resSuccess(res);
        }
    }
);
export default router;
