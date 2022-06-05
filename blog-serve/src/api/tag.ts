import { Router } from "express";
import RUOYU from "../config/ruoyu";
import { check, validationResult } from "express-validator";
import { addTag } from "../db/api/tag";

const router = Router();

router.get("/list", (req, res) => {
    RUOYU.resSuccess(res, { a: 46 });
});

// 新增
router.post(
    "/",
    check("content").custom((value: string) => {
        if (value.replace(/[^\x00-\xff]/g, "12").length > 16) {
            return false;
        }
        return true;
    }),
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }
        const { content, reason } = req.body;

        const [, status] = await addTag({
            content,
            reason,
            status: req.session.blog.status > 1 ? 1 : 0,
            userId: req.session.account.accountId,
        });
        if (status) {
            RUOYU.resSuccess(res);
        } else {
            RUOYU.resError(res, { msg: "标签已存在" });
        }
    }
);

export default router;
