const table = layui.table;
const util = layui.util;
const form = layui.form;

table.render({
    id: "tagTable",
    elem: "#tag",
    url: "/api/tag/list?user=my",
    page: true,
    cols: [
        [
            {
                field: "tagId",
                title: "ID",
                width: 100,
            },

            {
                field: "content",
                title: "标签",
            },
            {
                title: "使用次数",
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
                    return util.toDateString(createdAt, "yyyy-MM-dd HH:mm");
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

table.on("tool(tag)", function (obj) {
    if (obj.event === "del") {
        layer.confirm("删除操作不可恢复，确定删除吗？", (index) => {
            layer.load(2);
            layer.close(index);
            axios({
                method: "delete",
                url: "/api/tag",
                params: { tagId: obj.data.tagId },
            }).then(({ data: res }) => {
                layer.closeAll("loading");
                if (res.code === 0) {
                    $ryTools.notify({
                        description: res.msg,
                    });
                    table.reload("tagTable");
                } else {
                    $ryTools.notify({
                        description: res.msg,
                        type: "error",
                    });
                }
            });
        });
    } else if (obj.event === "edit") {
        layer.confirm("还没做呢", function (index) {
            // obj.del();
            layer.close(index);
        });
    }
});

$ry(".add-tag").click(() => {
    layer.open({
        type: 1,
        title: "创建标签",
        area: "375px",
        content: $ry(".addTagFrom").html(),
        success: (layero, index) => {
            form.render();
            form.on("submit(form)", function ({ field: data }) {
                layer.load(2);
                layer.close(index);
                axios({
                    method: "post",
                    url: "/api/tag",
                    data: Qs.stringify(data),
                }).then(({ data: res }) => {
                    layer.closeAll("loading");
                    if (res.code === 0) {
                        $ryTools.notify({
                            description: res.msg,
                        });
                        table.reload("tagTable");
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
