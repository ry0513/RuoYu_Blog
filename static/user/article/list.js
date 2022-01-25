layui.use(["table", "util", "element"], () => {
    const { table, util, element } = layui;
    table.render({
        elem: "#article",
        url: "/api/article/list",
        page: true,
        cols: [
            [
                {
                    field: "articleId",
                    title: "ID",
                    width: 100,
                },
                {
                    field: "title",
                    title: "标题",
                },

                {
                    title: "状态",
                    width: 80,
                    templet: ({ status }) => {
                        switch (status) {
                            case 0:
                                return "草稿";
                            case 1:
                                return "审核中";
                            case 2:
                                return "发布";
                            case 3:
                                return "回收站";
                        }
                    },
                },

                {
                    title: "标签",
                    width: 200,
                    templet: ({ tags }) => {
                        let str = "";
                        tags.forEach((item) => {
                            str += `<span class="layui-badge layui-bg-green">${item.content}</span>\n`;
                        });
                        return str;
                    },
                },
                {
                    field: "password",
                    title: "密码",
                    width: 100,
                },

                {
                    title: "创建时间",
                    width: 160,
                    templet: ({ createdAt }) => {
                        return util.toDateString(createdAt, "yyyy-MM-dd HH:mm:ss");
                    },
                },

                {
                    title: "操作",
                    width: 115,
                    templet: ({ articleId }) => {
                        return `<a href='/user/article/edit?article=${articleId}' class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`;
                    },
                },
            ],
        ],
    });
    table.on("tool(article)", (obj) => {
        var data = obj.data;
        console.log(obj);
        if (obj.event === "del") {
            layer.confirm("真的删除行么", function (index) {
                obj.del();
                layer.close(index);
            });
        }
    });
    element.on("tab(statusTab)", (data) => {
        const param = {};
        const status = $ry(".layui-tab-title .layui-this").attr("status");
        console.log(status);
        if (status) param.status = status;

        table.reload("article", {
            where: param,
            page: {
                curr: 1, //重新从第 1 页开始
            },
        });
    });
});
