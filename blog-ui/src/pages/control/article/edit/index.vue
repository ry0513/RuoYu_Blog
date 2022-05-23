<template>
    <t-card :bordered="false">
        <div class="ry-card_top ry-flex mb-20">
            <t-input
                class="article_title"
                v-model="article.title"
                placeholder="请输入文章标题"
                :maxlength="maxlength"
                :suffix="suffix"
            />
            <t-button theme="primary" variant="outline">草稿</t-button>
            <t-button theme="primary">提交</t-button>
        </div>
        <Editor :valueHtml="valueHtml" />
    </t-card>
</template>

<script setup lang="ts">
import Editor from "@/components/editor/index.vue";
import { computed, onMounted, ref } from "vue";
const article = ref({
    title: ""
});
const valueHtml = ref("<p>VUE</p>");
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = "<p>VUE+++</p>";
//     }, 1500);
// });

const maxlength = 30;
const suffix = computed(() => {
    return `${article.value.title.length}/${maxlength}`;
});
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
