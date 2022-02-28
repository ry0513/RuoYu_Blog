import { Router } from "express";
import { needVerify } from "../core/permission";
import RUOYU from "../core/ruoyu";
import { toPInt, toString } from "../core/tools";
import { addTag, delTag, delTagArticleByTagId, getTag, getTagCount, getTagList, setTag } from "../db/api/tag";
const router = Router();

// 列表
router.get("/list", (req, res) => {
    needVerify(10, req, res, async () => {
        const page = toPInt(req.query.page, { min: 1, def: 1 });
        const limit = toPInt(req.query.limit, { scope: [10, 20, 30] });
        const user = toString(req.query.user);
        if (page && limit) {
            let obj: { userId?: number } = {};
            if (user === "my") {
                obj = { userId: req.session.blog.userId };
            }
            const data = await getTagList(obj, (page - 1) * limit, limit, ["status", "reason", "reply"]);
            const count = await getTagCount(obj);
            RUOYU.res.success(res, { count, data });
            return;
        }
        RUOYU.res.parameter(res);
    });
});

// 新增
router.post("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const content = toString(req.body.content, { maxLength: 20 });
        const reason = toString(req.body.reason, { maxLength: 200 });
        if (content && reason) {
            const [, status] = await addTag({ content, reason, status: req.session.blog.status >= 40 ? 2 : 1, userId: req.session.blog.userId });
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

// 修改
router.put("/", (req, res) => {
    needVerify(40, req, res, async () => {
        const content = toString(req.body.content, { maxLength: 20 });
        const reason = toString(req.body.reason, { maxLength: 200 });
        const tagId = toPInt(req.body.tagId);
        if (content && reason && tagId) {
            const tag = await getTag({ tagId });
            if (tag) {
                if (tag.userId === req.session.blog.userId && tag.status !== 2) {
                    // await setTag({ tagId, content, reason, status: 0 });
                    if (await getTag({ content })) {
                        RUOYU.res.error(res, { msg: "修改失败，标签已存在" });
                    } else {
                        await setTag({ tagId, content, reason, status: 0 });
                        RUOYU.res.success(res);
                    }
                } else {
                    RUOYU.res.error(res, { msg: "修改失败，标签已通过审核" });
                }
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
            const tag = await getTag({ tagId });
            if (tag) {
                if ((tag.userId === req.session.blog.userId && tag.status !== 2) || req.session.blog.status === 1000) {
                    await delTagArticleByTagId(tagId);
                    await delTag(tagId);
                    RUOYU.res.success(res);
                } else {
                    RUOYU.res.error(res, { msg: "删除失败，没有权限或标签已通过审核" });
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
