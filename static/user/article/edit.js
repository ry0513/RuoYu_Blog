const article = (editor, obj = {}) => {
    const data = { title: $ry("#title").val(), content: editor.children, html: editor.getHtml(), ...obj };
    const articleId = $ryTools.getUrlValue("article");
    if (articleId) {
        data.articleId = articleId;
        axios({
            method: "post",
            url: "/api/article/set",
            data: Qs.stringify(data),
        }).then(({ data: res }) => {
            if (res.code === 0) {
                $ryTools.notify({
                    description: res.msg,
                });
                if (data.status === "release") {
                    layer.close(layer.index);
                    setTimeout(() => {
                        window.location.href = "/user/article";
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
            data: Qs.stringify(data),
        }).then(({ data: res }) => {
            if (res.code === 0) {
                $ryTools.notify({
                    description: res.msg,
                });
                window.history.replaceState({}, "", `?article=${res.articleId}`);
                if (data.status === "release") {
                    layer.close(layer.index);
                    setTimeout(() => {
                        window.location.href = "/user/article";
                    }, 1000);
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

const form = layui.form;
const editorConfig = {
    placeholder: "请输入内容",
    scroll: false,
    MENU_CONF: {
        uploadImage: {
            fieldName: "like-yuque-fileName",
            base64LimitSize: 0.1 * 1024 * 1024, // 10M 以下插入 base64
        },
        fontFamily: {
            fontFamilyList: ["黑体", "仿宋", "楷体", "标楷体", "宋体", "微软雅黑", "Arial", "Tahoma", "Verdana"],
        },
    },
};

const create = ({ content = "", title = "", images = [], sortId = "", tags = [] }) => {
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

    setTimeout(() => {
        $ry(".w-e-toolbar").append($ry(".divider").element);
        $ry(".w-e-toolbar").append($ry(".draft").element);
        $ry(".w-e-toolbar").append($ry(".release").element);
    }, 0);

    $ry("#editor-text-area").click((e) => {
        if (e.target.id === "editor-text-area") {
            editor.blur();
            editor.focus(true);
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

    $ry(".editor-toolbar").on("click", ".draft", () => {
        if (verifyData()) {
            article(editor, { status: "draft" });
        }
    });

    $ry(".editor-toolbar").on("click", ".release", () => {
        if (verifyData()) {
            layer.open({
                type: 1,
                title: "发布文章",
                area: "375px",
                content: $ry(".release-from").html(),
                success: () => {
                    $ry(".layui-layer-content [name=images]").val(images[0]);
                    $ry(".layui-layer-content .sort").val(sortId);
                    tags.forEach(({ tagId }) => {
                        $ry(`.layui-layer-content #tag-${tagId}`).attr("checked", true);
                    });
                    form.render();
                    form.on("submit(form)", function ({ field: data }) {
                        data.tags = [];
                        data.status = "release";
                        data.images = [data.images];
                        $ry(".layui-layer-content input[type=checkbox]:checked").each(function () {
                            data.tags.push($ry(this).val());
                        });
                        article(editor, data);
                    });
                },
            });
        }
    });
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
    create({});
}
