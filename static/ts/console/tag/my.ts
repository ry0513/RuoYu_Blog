layui.use(["table", "util", "form", "layer"], () => {
    const { table, util, form, layer } = layui;
    const openLayer = (value = "") => {
        layer.open({
            title: "提交标签",
            area: "350px",
            btnAlign: "c",
            closeBtn: 0, //右上角的关闭
            content: `<div class="layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">标签名</label>
                <div class="layui-input-block">
                    <input id="content" type="text" name="content" required lay-verify="required" placeholder="请输入标签名称" autocomplete="off" class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">原因</label>
                <div class="layui-input-block">
                <textarea id="reason" placeholder="请输入原因" class="layui-textarea"></textarea>
                </div>
            </div>
        </div>`,
            btn: ["确认", "取消"],
            yes: function (index, layero) {
                console.log(layero);
                const content = $ry("#content").val(); //获取多行文本框的值
                const reason = $ry("#reason").val();
                if (content && reason) {
                    addTag({ reason: reason as string, content: content as string });
                    return;
                }
                $ryTools.notify({
                    description: "标签名与原因不可为空",
                    type: "error",
                });
                layer.closeAll("loading");
            },
        });
    };
    const addTag = (data: { content: string; reason: string }) => {
        axios({
            method: "post",
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
            layout: ["count", "limit", "prev", "page", "next"],
            groups: 1,
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
                    field: "content",
                    title: "原因",
                },

                {
                    field: "content",
                    title: "回应",
                },

                {
                    field: "content",
                    title: "申请时间",
                },

                {
                    title: "申请时间",
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
            openLayer("ss");
            // layer.confirm("还没做呢", function (index) {
            //     // obj.del();
            //     layer.close(index);
            // });
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
