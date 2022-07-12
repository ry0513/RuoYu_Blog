<template>
    <t-card :bordered="false" class="ry-card">
        <div class="ry-flex mb-20">
            <t-input class="article_title" v-model="article.title" placeholder="请输入文章标题" :maxlength="maxlength" :suffix="suffix" />
            <t-button theme="primary" variant="outline" @click="submit()">草稿</t-button>
            <t-button theme="primary" @click="additionalClick">提交</t-button>
        </div>
        <Editor :valueHtml="article.html" @onChange="onChange" />
    </t-card>

    <Additional :show="additionalShow" :articleData="article" @additionalClose="additionalShow = false" @submit="(data) => submit(1, data)" />
</template>

<script setup lang="ts">
import { createArticle, getArticleByEdit } from "@/api/article";
import { computed, reactive, ref } from "vue";

import Editor from "@/components/editor/index.vue";
import Additional from "./additional.vue";
import { NotifyPlugin } from "tdesign-vue-next";
import router from "@/router";

const additionalShow = ref(false);
// 定义 文章
const article = reactive({
    articleId: null,
    title: "",
    html: "",
    content: "",
});
// 定义 标题最大长度
const maxlength = 50;
const minlength = 5;

const articleId = router.currentRoute.value.query.articleId;
if (articleId) {
    getArticleByEdit(articleId as string)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
}

// 事件 编辑器改变
const onChange = ({ html, content }: { html: string; content: string }) => {
    article.html = html;
    article.content = content;
};

// 计算属性 标题长度
const suffix = computed(() => {
    return article.title.length >= minlength ? `${article.title.length}/${maxlength}` : `还需要输入${minlength - article.title.length}个字`;
});

// 检验标题/内容是否满足
const IsArticle = () => {
    if (article.title.length < minlength) {
        NotifyPlugin.error({
            title: "标题错误",
            content: "标题至少5个字",
            closeBtn: true,
        });
        return false;
    }
    if (article.content === "") {
        NotifyPlugin.error({
            title: "内容错误",
            content: "内容不可为空",
            closeBtn: true,
        });
        return false;
    }
    return true;
};

// 点击提交
const additionalClick = () => {
    if (IsArticle()) {
        additionalShow.value = true;
    }
};

// 事件 草稿点击
const submit = (status = 0, data = {}) => {
    if (IsArticle()) {
        if (article.articleId) {
            console.log(article.articleId);
            // .push("/")
        } else {
            createArticle({ status, ...article, ...data }).then(({ data }) => {
                NotifyPlugin.success({
                    title: "保存成功",
                    content: `文章ID为${data.articleId}`,
                    closeBtn: true,
                });
                article.articleId = data.articleId;
                router.replace(`${router.currentRoute.value.fullPath}?articleId=${data.articleId}`);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.article_title {
    flex: 1 1 auto;
}
:deep(.t-button) {
    margin-left: 16px;
    flex-shrink: 0;
}
:deep(.t-input__suffix) {
    color: rgba(0, 0, 0, 0.4);
}
</style>
