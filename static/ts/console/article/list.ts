layui.use(["table", "util", "element"], () => {
    const { table, util, element, layer } = layui;

    const statusChange = (data: { articleId: number; status: number }) => {
        return new Promise((resolve) => {
            layer.load(2);
            axios({
                method: "put",
                url: "/api/article/statusChange",
                data: qs.stringify(data),
            }).then(({ data: res }) => {
                if (res.code === 0) {
                    $ryTools.notify({
                        description: res.msg,
                    });
                    for (const key in res.count) {
                        if (Object.prototype.hasOwnProperty.call(res.count, key)) {
                            $ry(`.status_${key}`).html(res.count[key]);
                        }
                    }
                    table.reload("articleTable");
                } else {
                    $ryTools.notify({
                        description: res.msg,
                        type: "error",
                    });
                }
                layer.closeAll("loading");
                resolve(true);
            });
        });
    };

    table.render({
        elem: "#articleTable",
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
                    title: "分类",
                    width: 100,
                    templet: ({ sort }) => {
                        return sort?.content || "未分类";
                    },
                },
                {
                    field: "title",
                    title: "标题",
                },
                {
                    title: "状态",
                    width: 100,
                    templet: ({ status }): string => {
                        switch (status) {
                            case 0:
                                return "草稿";
                            case 1:
                                return "审核中";
                            case 2:
                                return "发布";
                            case 3:
                                return "回收站";
                            default:
                                return "参数错误";
                        }
                    },
                },

                {
                    title: "标签",
                    width: 200,
                    templet: ({ tags }) => {
                        let str = "";
                        tags.forEach(({ content }: { content: string }) => {
                            str += `<span class="layui-badge layui-bg-blue">${content}</span>\n`;
                        });
                        return str;
                    },
                },
                {
                    title: "密码",
                    width: 150,
                    templet: ({ password }) => {
                        return password || "无需密码";
                    },
                },

                {
                    title: "发布时间",
                    width: 200,
                    templet: ({ releaseAt }) => {
                        return releaseAt ? util.toDateString(releaseAt, "yyyy-MM-dd HH:mm:ss") : "未发布过";
                    },
                },

                {
                    title: "操作",
                    width: 200,
                    templet: ({ articleId, status }) => {
                        if (status === 0) {
                            return `<a href='/console/article/edit?article=${articleId}' class="layui-btn layui-btn-xs">编辑</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="recycle">删除</a>`;
                        }
                        if (status === 3) {
                            return `<a class="layui-btn layui-btn-xs" lay-event="draft">移出</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`;
                        }
                        return `<a href='/article/${articleId}' target="_blank" class="layui-btn layui-btn-xs layui-btn layui-btn-warm">预览</a>
                            <a href='/console/article/edit?article=${articleId}' class="layui-btn layui-btn-xs">编辑</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="recycle">删除</a>`;
                    },
                },
            ],
        ],
    });

    table.on("tool(article)", ({ event, data }) => {
        if (event === "recycle") {
            layer.confirm("移入回收站？", (index) => {
                statusChange({ articleId: data.articleId, status: 3 });
                layer.close(index);
            });
        }
        if (event === "draft") {
            layer.confirm("移入草稿箱？", (index) => {
                statusChange({ articleId: data.articleId, status: 0 });
                layer.close(index);
            });
        }
    });
    element.on("tab(statusTab)", () => {
        const param: { status?: Array<number> } = {};
        const status = $ry(".layui-tab-title .layui-this").attr("status");
        if (status) param.status = [status as unknown as number];
        table.reload("articleTable", {
            where: param,
            page: {
                curr: 1, //重新从第 1 页开始
            },
        });
    });
});
