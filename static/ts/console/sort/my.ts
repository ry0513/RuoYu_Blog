layui.use(["table", "util", "form", "layer"], () => {
    const { table, util, form, layer } = layui;

    table.render({
        id: "sortTable",
        elem: "#sort",
        url: "/api/sort/list?user=my",
        page: true,
        cols: [
            [
                {
                    field: "sortId",
                    title: "ID",
                    width: 100,
                },

                {
                    field: "content",
                    title: "分类",
                },
                {
                    title: "文章数量",
                    templet: ({ articles }) => {
                        return articles.length;
                    },
                },
                {
                    title: "创建者",
                    templet: ({ user }) => {
                        return user.nickName;
                    },
                },
                {
                    title: "创建时间",
                    templet: ({ createdAt }) => {
                        return util.toDateString(createdAt, "yyyy-MM-dd HH:mm:ss");
                    },
                },

                {
                    title: "操作",
                    templet: () => {
                        return `<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`;
                    },
                },
            ],
        ],
    });

    table.on("tool(sort)", ({ data, event }) => {
        if (event === "del") {
            layer.confirm("删除操作不可恢复，确定删除吗？", (index) => {
                layer.load(2);
                layer.close(index);
                axios({
                    method: "delete",
                    url: "/api/sort",
                    params: { sortId: data.sortId },
                }).then(({ data: res }) => {
                    layer.closeAll("loading");
                    if (res.code === 0) {
                        $ryTools.notify({
                            description: res.msg,
                        });
                        table.reload("sortTable");
                    } else {
                        $ryTools.notify({
                            description: res.msg,
                            type: "error",
                        });
                    }
                });
            });
        } else if (event === "edit") {
            console.log(data);

            layer.open({
                type: 1,
                title: "创建分类",
                area: "375px",
                content: $ry(".addSortFrom").html(),
                success: (layero, index) => {
                    $ry(".layui-layer .layui-input").val(data.content), form.render();
                    form.on("submit(form)", ({ field }) => {
                        layer.load(2);
                        layer.close(index);
                        field.sortId = data.sortId;
                        axios({
                            method: "put",
                            url: "/api/sort",
                            data: qs.stringify(data),
                        }).then(({ data: res }) => {
                            layer.closeAll("loading");
                            if (res.code === 0) {
                                $ryTools.notify({
                                    description: res.msg,
                                });
                                table.reload("sortTable");
                            } else {
                                $ryTools.notify({
                                    description: res.msg,
                                    type: "error",
                                });
                            }
                        });
                    });
                },
            });
        }
    });

    $ry(".add-sort").click(() => {
        layer.open({
            type: 1,
            title: "创建分类",
            area: "375px",
            content: $ry(".addSortFrom").html(),
            success: (layero, index) => {
                form.render();
                form.on("submit(form)", ({ field }) => {
                    layer.load(2);
                    layer.close(index);
                    axios({
                        method: "post",
                        url: "/api/sort",
                        data: qs.stringify(field),
                    }).then(({ data: res }) => {
                        layer.closeAll("loading");
                        if (res.code === 0) {
                            $ryTools.notify({
                                description: res.msg,
                            });
                            table.reload("sortTable");
                        } else {
                            $ryTools.notify({
                                description: res.msg,
                                type: "error",
                            });
                        }
                    });
                });
            },
        });
    });
});
