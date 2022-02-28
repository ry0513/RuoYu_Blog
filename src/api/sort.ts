import { Router } from "express";
import { needVerify } from "../core/permission";
import RUOYU from "../core/ruoyu";
import { toPInt, toString } from "../core/tools";
import { addSort, delSort, getSort, getSortCount, getSortList } from "../db/api/sort";
const router = Router();

// 列表
router.get("/list", (req, res) => {
    needVerify(10, req, res, async () => {
        const page = toPInt(req.query.page, { min: 1, def: 1 });
        const limit = toPInt(req.query.limit, { def: 10, scope: [10, 20, 30] });
        const user = toString(req.query.user);
        if (page && limit) {
            let param: { userId?: number } = {};
            if (user === "my") {
                param = { userId: req.session.blog.userId };
            }
            const data = await getSortList(param, (page - 1) * limit, limit);
            const count = await getSortCount(param);
            RUOYU.res.success(res, { count, data });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 新增
router.post("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const content = toString(req.body.content, { maxLength: 10 });
        if (content) {
            const [, status] = await addSort({ content, userId: req.session.blog.userId });
            if (status) {
                RUOYU.res.success(res);
            } else {
                RUOYU.res.error(res, { msg: "分类已存在，无需重复创建" });
            }
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 更新
router.put("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const content = toString(req.body.content, { maxLength: 10 });
        const sortId = toPInt(req.body.sortId);
        if (content && sortId) {
            const data = await getSort(sortId);
            if (data) {
                if (data.userId !== req.session.blog.userId && req.session.blog.status !== 1000) {
                    RUOYU.res.error(res, { msg: "权限不足，非创建者" });
                } else if (data.articles.length > 0) {
                    RUOYU.res.error(res, { msg: "分类下尚有文章" });
                } else {
                    await delSort(sortId);
                    RUOYU.res.success(res);
                }
                return;
            }
            RUOYU.res.error(res, { msg: "分类不存在，请尝试刷新页面" });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 删除
router.delete("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const sortId = toPInt(req.query.sortId);
        if (sortId) {
            const data = await getSort(sortId);
            if (data) {
                if (data.userId !== req.session.blog.userId && req.session.blog.status !== 1000) {
                    RUOYU.res.error(res, { msg: "权限不足，非创建者" });
                } else if (data.articles.length > 0) {
                    RUOYU.res.error(res, { msg: "分类下尚有文章" });
                } else {
                    await delSort(sortId);
                    RUOYU.res.success(res);
                }
                return;
            }
            RUOYU.res.error(res, { msg: "分类不存在，请尝试刷新页面" });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

export default router;
