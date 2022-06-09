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
            <t-button
                theme="primary"
                variant="outline"
                @click="additionalShow = true"
                >草稿</t-button
            >
            <t-button theme="primary">提交</t-button>
        </div>
        <Editor :valueHtml="article.html" @onChange="onChange" />
    </t-card>

    <t-dialog
        v-model:visible="additionalShow"
        :closeOnOverlayClick="false"
        :footer="false"
        header="对话框标题"
        :width="getWinWidth > 800 ? 800 : getWinWidth - 20"
    >
        <Additional />
    </t-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import { storeToRefs } from "pinia";
import { getSettingStore } from "@/store";
import Editor from "@/components/editor/index.vue";
import Additional from "./additional.vue";

const store = getSettingStore();
const { getWinWidth } = storeToRefs(store);

const additionalShow = ref(true);
// 定义 文章
const article = reactive({
    title: "",
    html: "",
});
// 定义 标题最大长度
const maxlength = 50;

// 事件 编辑器改变
const onChange = (html: string) => {
    article.html = html;
};

// 计算属性 标题长度
const suffix = computed(() => {
    return article.title.length > 4
        ? `${article.title.length}/${maxlength}`
        : `还需要输入${5 - article.title.length}个字`;
});

// 事件 草稿点击
const test = () => {
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
