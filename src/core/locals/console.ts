import { Request, Response } from "express";
export default (req: Request, res: Response) => {
    res.locals = {
        current: req.path,
        menuActive: ({ isMenu, path }: { isMenu: boolean; path: string }, current: string, { path: parentPath }: { path?: string } = {}) => {
            const currentPath = "/" + current.split("/")[1];
            if ((!parentPath && path === currentPath) || (parentPath && parentPath === currentPath && path === current.replace(currentPath, ""))) {
                return isMenu ? " layui-this" : " layui-nav-itemed";
            }
        },
        getPath: ({ isMenu, path }: { isMenu: boolean; path: string }) => {
            return isMenu ? `/console${path}` : "javascript:;";
        },

        getBreadcrumb: (
            menu: Array<{
                path: string;
                menuName: string;
                children?: Array<{ path: string; menuName: string }>;
            }>,
            current: string
        ) => {
            if (current === "/") return "";
            const currentPath1 = "/" + current.split("/")[1];
            const currentPath2 = current.replace(currentPath1, "");

            let res = "<div class='layui-breadcrumb'><a href=''>首页</a>";
            menu.forEach((item) => {
                if (item.path === currentPath1) {
                    if (item.children) {
                        res += `<a href="/console${item.path}">${item.menuName}</a>`;
                        item.children.forEach((childrenItem) => {
                            if (childrenItem.path === currentPath2) {
                                res += `<a><cite>${childrenItem.menuName}</cite></a>`;
                            }
                        });
                    } else {
                        res += `<a><cite>${item.menuName}</cite></a>`;
                    }
                }
            });
            return (res += "</div>");
        },
        menu: [
            {
                menuName: "首页",
                path: "/",
                isMenu: true,
                icon: "string",
            },
            {
                menuName: "文章管理",
                path: "/article",
                isMenu: false,
                icon: "string",
                children: [
                    {
                        menuName: "文章列表",
                        path: "",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                    {
                        menuName: "新增文章",
                        path: "/edit",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                ],
            },
            {
                menuName: "标签管理",
                path: "/tag",
                isMenu: false,
                icon: "string",
                children: [
                    {
                        menuName: "标签列表",
                        path: "",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                    {
                        menuName: "审核标签",
                        path: "/audit",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                    {
                        menuName: "我的想法",
                        path: "/my",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                ],
            },
            {
                menuName: "分类管理",
                path: "/sort",
                isMenu: false,
                icon: "string",
                children: [
                    {
                        menuName: "分类列表",
                        path: "",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                    {
                        menuName: "我的分类",
                        path: "/my",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                ],
            },
            {
                menuName: "留言管理",
                path: "/message",
                isMenu: false,
                icon: "string",
                children: [
                    {
                        menuName: "留言列表",
                        path: "",
                        isMenu: true,
                        icon: "string",
                        remark: "系统生成的导航测试B_1",
                    },
                ],
            },
        ],
    };
};
