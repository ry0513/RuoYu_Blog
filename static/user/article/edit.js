const article = (obj = {}) => {
    const data = { title: $ry(".article-title").val(), content: JSON.stringify(editor.children), html: editor.getHtml(), ...obj };
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
                    }, 1000);
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
            } else {
                $ryTools.notify({
                    description: res.msg,
                    type: "error",
                });
            }
        });
    }
};

const editorConfig = { MENU_CONF: {} };
editorConfig.placeholder = "请输入内容";
editorConfig.scroll = false; // 禁止编辑器滚动
editorConfig.MENU_CONF["uploadImage"] = {
    fieldName: "like-yuque-fileName",
    base64LimitSize: 0.1 * 1024 * 1024, // 10M 以下插入 base64
};

const content = $ry(".article-content").html();

// 先创建 editor
const editor = wangEditor.createEditor({
    selector: "#editor-text-area",
    content: content ? JSON.parse(content) : "",
    config: editorConfig,
});

// 创建 toolbar
const toolbar = wangEditor.createToolbar({
    editor,
    selector: "#editor-toolbar",
    config: {
        excludeKeys: "fullScreen",
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
    if ($ry(".article-title").val() === "" || editor.isEmpty()) {
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
        article({ status: "draft" });
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
                layui.use("form", () => {
                    const form = layui.form;
                    form.render();
                    form.on("submit(form)", function ({ field: data }) {
                        data.tags = [];
                        data.status = "release";
                        data.images = [data.images];
                        $ry(".layui-layer-content input[type=checkbox]:checked").each(function () {
                            data.tags.push($ry(this).val());
                        });
                        article(data);
                    });
                });
            },
        });
    }
});
