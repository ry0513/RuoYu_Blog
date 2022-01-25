import { Router } from "express";
import { needVerify } from "../../core/permission";
import RUOYU from "../../core/ruoyu";
import { toPInt, toString } from "../../core/tools";
import { addSort, delSort, getSort, getSortCount, getSortList } from "../../db/api/sort";
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
                obj = { userId: req.session.userData.userId };
            }
            const data = await getSortList(obj, (page - 1) * limit, limit);
            const count = await getSortCount(obj);
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
            const [, status] = await addSort({ content, userId: req.session.userData.userId });
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
        const sortId = toPInt(req.query.sortId);
        if (sortId) {
            const data = await getSort(sortId);

            if (data) {
                if (data.userId !== req.session.userData.userId && req.session.userData.userStatus !== 1000) {
                    RUOYU.res.error(res, { msg: "权限不足，该标签不属于你" });
                } else if (data.articles.length > 0) {
                    RUOYU.res.error(res, { msg: "标签正在被使用" });
                } else {
                    await delSort(sortId);
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
