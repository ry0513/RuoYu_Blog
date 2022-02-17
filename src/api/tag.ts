import { Router } from "express";
import { needVerify } from "../core/permission";
import RUOYU from "../core/ruoyu";
import { toPInt, toString } from "../core/tools";
import { addTag, delTag, getTag, getTagCount, getTagList } from "../db/api/tag";
const router = Router();

// 列表
router.get("/list", (req, res) => {
    needVerify(10, req, res, async () => {
        const page = toPInt(req.query.page, 1);
        const limit = toPInt(req.query.limit, 10);
        const user = toString(req.query.user);
        if (page && limit) {
            let obj: { userId?: number } = {};
            if (user === "my") {
                obj = { userId: req.session.blog.userId };
            }
            const data = await getTagList(obj, (page - 1) * limit, limit);
            const count = await getTagCount(obj);
            RUOYU.res.success(res, { count, data });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

//新增
router.post("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const content = toString(req.body.content);
        if (content) {
            const [, status] = await addTag({ content, userId: req.session.blog.userId });
            if (status) {
                RUOYU.res.success(res);
            } else {
                RUOYU.res.error(res, { msg: "标签已存在" });
            }
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 删除
router.delete("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const tagId = toPInt(req.query.tagId);
        if (tagId) {
            const data = await getTag(tagId);
            if (data) {
                if (data.userId !== req.session.blog.userId && req.session.blog.status !== 1000) {
                    RUOYU.res.error(res, { msg: "权限不足，该标签不属于你" });
                } else if (data.articles.length > 0) {
                    RUOYU.res.error(res, { msg: "标签正在被使用" });
                } else {
                    await delTag(tagId);
                    RUOYU.res.success(res);
                }
                return;
            }
            RUOYU.res.error(res, { msg: "标签不存在，请尝试刷新页面" });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

export default router;
