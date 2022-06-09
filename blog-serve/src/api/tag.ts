import { Router, Request } from "express";
import RUOYU from "../config/ruoyu";
import { check, validationResult } from "express-validator";
import { createTag, getTagList } from "../db/api/tag";
import { permission } from "../config/permission";
import { currentPage, toArr, toLike } from "../config/validator";
import { STATUS_TAG } from "../config/status";

const router = Router();
router.get(
    "/list",
    check("current")
        .default(1)
        .isInt({ min: 1, allow_leading_zeroes: false })
        .toInt()
        .customSanitizer(currentPage),
    check("pageSize")
        .default(10)
        .isInt({ min: 1, allow_leading_zeroes: false })
        .toInt(),
    check("status")
        .default(-1)
        .toInt()
        .isIn([...STATUS_TAG, -1])
        .customSanitizer(toArr),
    check("content").default("").isString().customSanitizer(toLike),
    async (req: Request<{}, {}, {}, RequestGet>, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { current, pageSize, status, content } = req.query;
        const where = { status, content };
        const data = await getTagList({
            where,
            current,
            pageSize,
            attributes: ["reason", "status", "remark", "createdAt"],
        });
        RUOYU.resSuccess(res, { ...data });
    }
);

// 新增
router.post(
    "/",
    check("content")
        .isString()
        .custom((value: string) => {
            if (value.replace(/[^\x00-\xff]/g, "12").length > 16) {
                return false;
            }
            return true;
        }),
    check("reason").isString().isLength({ max: 200 }),
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { content, reason } = req.body;

        const [tag, status] = await createTag({
            content,
            reason,
            status: req.session.blog.status > 1 ? 1 : 0,
            userId: req.session.account.accountId,
        });
        if (status) {
            RUOYU.resSuccess(res, {
                title: "新建成功",
                text: "当前状态为" + tag.status,
            });
        } else {
            RUOYU.resError(res, { title: "新建失败", text: "标签已存在" });
        }
    }
);

export default router;
