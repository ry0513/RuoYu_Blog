import { Router } from "express";
import RUOYU from "../config/ruoyu";
import { createUser, getUser } from "../db/api/user";
import { body, validationResult } from "express-validator";
import { getIp } from "../utils/tools";
import { login, PERMISSION } from "../config/permission";

const router = Router();

router.get("/userInfo", login({ hint: false }), async (req, res) => {
    let { account, blog } = req.session;
    const user = await getUser({ userId: account.accountId }, ["status", "permission"]);

    if (!user) {
        await createUser({
            userId: account.accountId,
            ip: getIp(req),
            nickName: account.nickName,
            avatar: account.avatar,
            permission: PERMISSION.lv1,
        });
    } else {
        console.log(user.permission);
        req.session.blog = {
            status: user.status,
            permission: user.permission,
        };
    }

    const route = [
        {
            path: "/control",
            name: "control",
            component: "layouts/control/index",
            redirect: "/control/home",
            meta: {
                title: "首页",
                icon: "",
            },
            children: [
                {
                    path: "home",
                    name: "controlHome",
                    component: "pages/control/home/index",
                    meta: {
                        title: "首页",
                        icon: "",
                    },
                },
                {
                    path: "article",
                    name: "controlArticle",
                    component: "layouts/blank",
                    redirect: "/control/article/list",
                    meta: {
                        title: "文章管理",
                        icon: "",
                    },
                    children: [
                        {
                            path: "list",
                            name: "controlArticleList",
                            component: "pages/control/article/list/index",
                            meta: {
                                title: "文字列表",
                                icon: "",
                            },
                        },
                        {
                            path: "edit",
                            name: "controlArticleEdit",
                            component: "pages/control/article/edit/index",
                            meta: {
                                title: "新增文章",
                                icon: "",
                                // full: true,
                            },
                        },
                    ],
                },
                {
                    path: "tag",
                    name: "controlTag",
                    component: "layouts/blank",
                    redirect: "/control/tag/list",
                    meta: {
                        title: "标签管理",
                        icon: "",
                    },
                    children: [
                        {
                            path: "list",
                            name: "controlTagList",
                            component: "pages/control/tag/list/index",
                            meta: {
                                title: "Tag列表",
                                icon: "",
                            },
                        },
                    ],
                },
                {
                    path: "sort",
                    name: "controlSort",
                    component: "layouts/blank",
                    redirect: "/control/sort/list",
                    meta: {
                        title: "分类管理",
                        icon: "",
                    },
                    children: [
                        {
                            path: "list",
                            name: "controlSortList",
                            component: "pages/control/sort/list/index",
                            meta: {
                                title: "sort列表",
                                icon: "",
                            },
                        },
                    ],
                },
            ],
        },
    ];

    RUOYU.resSuccess(res, {
        account: { ...account, ...blog },
        route: route,
    });
});

// // 注册
// router.get(
//     "/resister",
//     // body("nickName").isEmail(),
//     // body("password").isLength({ min: 5 }),
//     async (req, res) => {
//         console.log(req.body);
//         console.log(req.query);

//         // const errors = validationResult(req);
//         // console.log(errors.isEmpty());

//         RUOYU.resSuccess(res);
//         // const nickName = toString(req.body.nickName, { maxLength: 20 });
//         // if (nickName) {
//         //     const { accountId: userId, avatar, status } = req.session.account;
//         //     await createUser(req, userId, nickName, avatar, status);
//         //     req.session.blog = {
//         //         userId,
//         //         nickName,
//         //         avatar,
//         //         status,
//         //         articlePass: {},
//         //     };
//         //     RUOYU.resSuccess(res);
//         //     return;
//         // }
//         // RUOYU.resParameter(res);
//     }
// );

export default router;
