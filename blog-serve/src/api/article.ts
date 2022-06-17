import { Router, Request } from "express";
import RUOYU from "../config/ruoyu";
import { body, validationResult } from "express-validator";
import { front, toNumArr } from "../config/validator";

const router = Router();

// 获取全部
router.get("/list/all", async (req, res) => {
    // const data = await getSortListAll();
    RUOYU.resSuccess(res);
});

// 新增
router.post(
    "/",
    body("status").isIn([0, 1]).toInt(),
    body("title").isString().isLength({ min: 5, max: 50 }),
    body("html").isString(),
    body("content").isString(),
    body("passwd").default("").isString(),
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
        .custom((value: number[], { req }) => {
            return value.length === req.body.type;
        })
        .customSanitizer(toNumArr),

    // ,
    async (req, res) => {
        // const data = await getSortListAll();
        console.log(typeof req.body.status);
        console.log(req.body);
        if (!validationResult(req).isEmpty()) {
            return RUOYU.resParameter(res);
        }

        RUOYU.resSuccess(res);
    }
);

export default router;
