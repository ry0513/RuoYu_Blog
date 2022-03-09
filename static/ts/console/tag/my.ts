layui.use(["table", "util", "form", "layer"], () => {
    const { table, util, layer } = layui;
    const openLayer = ({ content = "", reason = "", tagId }: { content?: string; reason?: string; tagId?: number } = {}) => {
        layer.open({
            title: "提交标签",
            btnAlign: "c",
            closeBtn: 0, //右上角的关闭
            content: `<div class="layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">标签名</label>
                <div class="layui-input-block">
                    <input id="content" type="text" value='${content}' placeholder="请输入标签名称" autocomplete="off" class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                <textarea id="reason" placeholder="请输入备注" class="layui-textarea">${reason}</textarea>
                </div>
            </div>
        </div>`,
            btn: ["确认", "取消"],
            yes: () => {
                const content = $ry("#content").val(); //获取多行文本框的值
                const reason = $ry("#reason").val();
                if (content) {
                    if (tagId) {
                        setTag("put", { reason: reason as string, content: content as string, tagId });
                    } else {
                        setTag("post", { reason: reason as string, content: content as string });
                    }
                    return;
                }
                $ryTools.notify({
                    description: "标签不可为空",
                    type: "error",
                });
                layer.closeAll("loading");
            },
        });
    };
    const setTag = (method: "post" | "put", data: { content: string; reason: string; tagId?: number }) => {
        axios({
            method,
            url: "/api/tag",
            data: qs.stringify(data),
        }).then(({ data: res }) => {
            if (res.code === 0) {
                $ryTools.notify({
                    description: res.msg,
                });
                table.reload("tagTable");
                layer.closeAll();
            } else {
                $ryTools.notify({
                    description: res.msg,
                    type: "error",
                });
                layer.closeAll("loading");
            }
        });
    };
    table.render({
        id: "tagTable",
        elem: "#tag",
        url: "/api/tag/list?user=my",
        page: {
            limits: [10, 20, 30],
            layout: ["count", "limit", "prev", "page", "next"],
            first: false,
            last: false,
        },
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
                    field: "reason",
                    title: "备注",
                },
                {
                    title: "状态",
                    width: 100,
                    templet: ({ status }) => {
                        switch (status) {
                            case 0:
                                return "审核中";
                            case 1:
                                return "<span class='layui-font-red'>驳回</span>";
                            case 2:
                                return "<span class='layui-font-green'>正常</span>";
                            default:
                                return "未知";
                        }
                    },
                },

                {
                    field: "reply",
                    title: "回复",
                },

                {
                    title: "申请时间",
                    width: 200,
                    templet: ({ createdAt }) => {
                        return util.toDateString(createdAt, "yyyy-MM-dd HH:mm");
                    },
                },

                {
                    title: "操作",
                    templet: ({ status }) => {
                        if (status !== 2) {
                            return `<a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>`;
                        }
                        return "无需操作";
                    },
                },
            ],
        ],
    });

    table.on("tool(tag)", ({ event, data }) => {
        if (event === "del") {
            layer.confirm("删除操作不可恢复，确定删除吗？", (index) => {
                layer.load(2);
                layer.close(index);
                axios({
                    method: "delete",
                    url: "/api/tag",
                    params: { tagId: data.tagId },
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
        } else if (event === "edit") {
            openLayer(data);
        }
    });

    $ry(".add-tag").click(() => {
        openLayer();
        // layer.open({
        //     //formType: 2,//这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
        //     title: "是否确信将账号临时挂账?",
        //     area: ["300px", "240px"],
        //     btnAlign: "c",
        //     closeBtn: "1", //右上角的关闭
        //     content: '<div><p>备注:</p><textarea name="txt_remark" id="remark" style="width:200px;height:20px;"></textarea></div>',
        //     btn: ["确认"],
        //     yes: function (index, layero) {
        //         const value1 = $ry("#remark").val(); //获取多行文本框的值
        //         alert("您刚才输入了:" + value1);
        //         layer.close(index);

        //         //可执行确定按钮事件并把备注信息（即多行文本框值）存入需要的地方
        //     },
        // });
        // layer.open({
        //     type: 1,
        //     title: "创建标签",
        //     area: "375px",
        //     content: $ry(".addTagFrom").html(),
        //     success: (layero, index) => {
        //         form.render();
        //         form.on("submit(form)", function ({ field: data }) {
        //             layer.load(2);
        //             layer.close(index);
        //             axios({
        //                 method: "post",
        //                 url: "/api/tag",
        //                 data: qs.stringify(data),
        //             }).then(({ data: res }) => {
        //                 layer.closeAll("loading");
        //                 if (res.code === 0) {
        //                     $ryTools.notify({
        //                         description: res.msg,
        //                     });
        //                     table.reload("tagTable");
        //                 } else {
        //                     $ryTools.notify({
        //                         description: res.msg,
        //                         type: "error",
        //                     });
        //                 }
        //             });
        //         });
        //     },
        // });
    });
});
