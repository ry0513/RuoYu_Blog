import { Router, Request } from "express";
import RUOYU from "../config/ruoyu";
import { body, check, query, validationResult } from "express-validator";
import { createTag, getTagList, getTagListAll } from "../db/api/tag";
import { permission, permissionVerify } from "../config/permission";
import { currentPage, toArr, toLike } from "../config/validator";
import { STATUS_TAG } from "../config/status";

const router = Router();

router.get(
    "/list",
    query("current")
        .default(1)
        .isInt({ min: 1, allow_leading_zeroes: false })
        .toInt()
        .customSanitizer(currentPage),
    query("pageSize")
        .default(10)
        .isInt({ min: 1, allow_leading_zeroes: false })
        .toInt(),
    query("status")
        .default(-1)
        .toInt()
        .isIn([...STATUS_TAG, -1])
        .customSanitizer(toArr),
    query("content").default("").isString().customSanitizer(toLike),
    async (req: Request<{}, {}, {}, RequestGet>, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { current, pageSize, status, content } = req.query;

        const where = { status, content };
        const data = await getTagList({
            where,
            current: current * pageSize,
            pageSize,
            attributes: ["reason", "status", "remark", "createdAt"],
        });
        RUOYU.resSuccess(res, data);
    }
);

// 获取全部
router.get("/list/all", async (req, res) => {
    const data = await getTagListAll();
    RUOYU.resSuccess(res, data);
});

// 新增
router.post(
    "/",
    permission("tag:add:v1"),
    body("content")
        .isString()
        .custom((value: string) => {
            if (value.replace(/[^\x00-\xff]/g, "12").length > 16) {
                return false;
            }
            return true;
        }),
    body("reason").isString().isLength({ max: 200 }),
    async (req: Request, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { content, reason } = req.body;

        const [tag, status] = await createTag({
            content,
            reason,
            status: permissionVerify(req, "tag:add:audit") ? 1 : 0,
            userId: req.session.account.accountId,
            remark: permissionVerify(req, "tag:add:audit") ? "自动通过" : "",
        });
        if (status) {
            RUOYU.resSuccess(res, {
                title: "新建成功",
                text: `当前状态：${tag.status === 0 ? "等待审核" : "正常使用"}`,
            });
        } else {
            RUOYU.resError(res, { title: "新建失败", text: "标签已存在" });
        }
    }
);

export default router;
