<template>
    <t-card :bordered="false" class="ry-card">
        <div class="ry-flex mb-20">
            <t-input
                class="article_title"
                v-model="article.title"
                placeholder="请输入文章标题"
                :maxlength="maxlength"
                :suffix="suffix"
            />
            <t-button theme="primary" variant="outline" @click="test"
                >草稿</t-button
            >
            <t-button theme="primary">提交</t-button>
        </div>
        <Editor :valueHtml="article.html" @onChange="onChange" />
    </t-card>

    <Additional
        :show="additionalShow"
        :articleData="article"
        @additionalClose="additionalShow = false"
    />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import Editor from "@/components/editor/index.vue";
import Additional from "./additional.vue";

const additionalShow = ref(false);
// 定义 文章
const article = reactive({
    title: "",
    html: "",
    content: "",
});
// 定义 标题最大长度
const maxlength = 50;

// 事件 编辑器改变
const onChange = ({ html, content }: { html: string; content: string }) => {
    article.html = html;
    article.content = content;
};

// 计算属性 标题长度
const suffix = computed(() => {
    return article.title.length > 4
        ? `${article.title.length}/${maxlength}`
        : `还需要输入${5 - article.title.length}个字`;
});

// 事件 草稿点击
const test = () => {
    additionalShow.value = true;
    console.log(article);
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
