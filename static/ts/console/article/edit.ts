layui.use(["form", "layer"], async () => {
    const { form, layer } = layui;
    let timer: NodeJS.Timer;
    let taglist = "";
    let sortList = "";
    (() => {
        axios({
            url: "/api/article/infoWindow",
        }).then(({ data }) => {
            data.tags.forEach(({ tagId, content }: { tagId: number; content: string }) => {
                taglist += `<input type="checkbox" value="${tagId}" id="${tagId}" title="${content}" lay-skin="primary" />`;
            });
            data.sorts.forEach(({ sortId, content }: { sortId: number; content: string }) => {
                sortList += `<option value="${sortId}">${content}</option>`;
            });
            console.log(sortList);
        });
    })();

    const article = (editor: IDomEditor, obj: { status?: string } = {}) => {
        const data = {
            title: $ry("#title").val(),
            content: editor.children,
            html: editor.getHtml(),
            ...obj,
        };
        const articleId = $ryTools.getUrlValue("article");
        if (articleId) {
            axios({
                method: "put",
                url: "/api/article",
                data: qs.stringify({ articleId, ...data }),
            }).then(({ data: res }) => {
                if (res.code === 0) {
                    localforage.removeItem("article");
                    $ryTools.notify({
                        description: res.msg,
                    });
                    if (data.status === "release") {
                        layer.close(layer.index);
                        window.onbeforeunload = null;
                        setTimeout(() => {
                            window.location.replace("/console/article");
                        }, 500);
                    }
                } else {
                    $ryTools.notify({
                        description: res.msg,
                        type: "error",
                    });
                }
            });
        } else {
            axios({
                method: "post",
                url: "/api/article",
                data: qs.stringify(data),
            }).then(({ data: res }) => {
                if (res.code === 0) {
                    localforage.removeItem("article");
                    $ryTools.notify({
                        description: res.msg,
                    });
                    window.history.replaceState({}, "", `?article=${res.articleId}`);
                    clearInterval(timer);
                    if (data.status === "release") {
                        layer.close(layer.index);
                        window.onbeforeunload = null;
                        setTimeout(() => {
                            window.location.replace("/console/article");
                        }, 500);
                    }
                } else {
                    $ryTools.notify({
                        description: res.msg,
                        type: "error",
                    });
                }
            });
        }
    };

    // 富文本配置
    const editorConfig = {
        placeholder: "请输入内容",
        scroll: false,
        MENU_CONF: {
            uploadImage: {
                fieldName: "like-yuque-fileName",
                base64LimitSize: 0.1 * 1024 * 1024, // 插入 base64
            },
            fontFamily: {
                fontFamilyList: ["黑体", "仿宋", "楷体", "标楷体", "宋体", "微软雅黑", "Arial", "Tahoma", "Verdana"],
            },
            codeSelectLang: {
                // 代码语言
                codeLangs: [
                    { text: "CSS", value: "css" },
                    { text: "HTML", value: "html" },
                    { text: "Javascript", value: "javascript" },
                    { text: "Typescript", value: "typescript" },
                    { text: "Java", value: "java" },
                    { text: "PHP", value: "php" },
                    { text: "SQL", value: "sql" },
                    { text: "Bash", value: "bash" },
                    // 其他
                ],
            },
        },
    };

    // 创建富文本
    const create = ({
        content = "",
        title = "",
        images = [],
        sortId = "",
        tags = [],
        local = false,
    }: {
        content?: string | Array<object>;
        title?: string;
        images?: Array<string>;
        sortId?: string;
        tags?: Array<{ tagId: number }>;
        local?: boolean;
    }) => {
        $ry("#title").val(title);
        // 创建 editor
        const editor = wangEditor.createEditor({
            selector: "#editor-text-area",
            content,
            config: editorConfig,
        });
        // 创建 toolbar
        wangEditor.createToolbar({
            editor,
            selector: "#editor-toolbar",
            config: {
                excludeKeys: ["fullScreen", "emotion"],
            },
        });
        $ry(".w-e-toolbar").append($ry(".home").element);
        $ry(".w-e-toolbar").append($ry(".divider1").element);
        setTimeout(() => {
            $ry(".w-e-toolbar").append($ry(".divider2").element);
            $ry(".w-e-toolbar").append($ry(".draft").element);
            $ry(".w-e-toolbar").append($ry(".release").element);
        }, 0);

        $ry("#editor-text-area").click((e) => {
            if ((e?.target as HTMLElement).id === "editor-text-area") {
                editor.blur();
                editor.focus();
            }
        });

        const verifyData = () => {
            if ($ry("#title").val() === "" || editor.isEmpty()) {
                $ryTools.notify({
                    description: "标题和内容不可为空",
                    type: "error",
                });
                return false;
            }
            return true;
        };
        $ry(".home").click(() => {
            window.location.href = "/console/article";
        });
        $ry(".draft button:not(.disabled)").click(() => {
            if (verifyData()) {
                article(editor, { status: "draft" });
            }
        });
        $ry(".release button").click(() => {
            if (verifyData()) {
                layer.open({
                    title: "提交标签",
                    btnAlign: "c",
                    closeBtn: 0,
                    content: `<div class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">封面图片</label>
                        <div class="layui-input-block">
                            <input
                                type="text"
                                name="images"
                                required
                                value="https://"
                                lay-verify="url"
                                placeholder="请输入图片链接"
                                autocomplete="off"
                                class="layui-input"
                            />
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">所属分类</label>
                        <div class="layui-input-block">
                            <select name="sortId" lay-verify="required" class="sort">   
                                ${sortList}
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">文章标签</label>
                        <div class="layui-input-block tag-box">
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            <span class="layui-badge-rim">绿</span>
                            
                            <button type="button" class="layui-btn layui-btn-primary layui-btn-xs">
                                <i class="layui-icon layui-icon-edit"></i>
                            </button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">查看密码</label>
                        <div class="layui-input-block">
                            <input type="text" name="password" placeholder="不需要密码请不要填写" autocomplete="off" class="layui-input" />
                        </div>
                    </div>
                </div>`,
                    btn: ["确认", "取消"],
                    success: () => {
                        form.render();
                    },
                });
                // layer.open({
                //     title: "发布文章",
                //     btnAlign: "c",
                //     closeBtn: 0,
                //     content: $ry(".release-from").html(),
                //     btn: ["确认", "取消"],
                //     success: () => {
                //         $ry(".layui-layer-content [name=images]").val(images[0]);
                //         $ry(".layui-layer-content .sort").val(sortId);
                //         tags.forEach(({ tagId }) => {
                //             $ry(`.layui-layer-content #tag-${tagId}`).attr("checked", "true");
                //         });
                //         form.render();
                //         form.on("submit(form)", ({ field: data }) => {
                //             data.tags = [];
                //             data.status = "release";
                //             data.images = [data.images];
                //             $ry(".layui-layer-content input[type=checkbox]:checked").each((el) => {
                //                 data.tags.push((el as HTMLInputElement).value);
                //             });
                //             article(editor, data);
                //         });
                //     },
                // });
            }
        });
        if (local) {
            timer = setInterval(() => {
                localforage.setItem("article", {
                    content: editor.children,
                    title: $ry("#title").val(),
                });
            }, 10000);
        }
    };
    const articleId = $ryTools.getUrlValue("article");

    if (articleId) {
        axios({
            method: "get",
            url: "/api/article",
            params: { articleId },
        }).then(({ data: res }) => {
            if (res.code === 0) {
                create(res.article);
            } else {
                window.location.replace("/");
            }
        });
    } else {
        create({
            local: true,
            ...((await localforage.getItem("article")) as {
                content: Array<object>;
                title: string;
            }),
        });
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/API/WindowEventHandlers/onbeforeunload
    window.onbeforeunload = (e) => {
        e = e || window.event;
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
            e.returnValue = "关闭提示";
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return "关闭提示";
    };
});
