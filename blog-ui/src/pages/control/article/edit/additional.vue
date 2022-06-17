<template>
    <t-dialog
        v-model:visible="show"
        :closeOnOverlayClick="false"
        header="对话框标题"
        :width="getWinWidth > 800 ? 800 : getWinWidth - 20"
        @confirm="confirm"
        @close="close"
    >
        <t-form
            label-width="calc(2em + 25px)"
            ref="articleForm"
            :data="article"
        >
            <t-form-item
                label="样式"
                class="column"
                :rules="[{ required: true, type: 'error' }]"
                name="type"
            >
                <t-select v-model="article.type" placeholder="请选择样式">
                    <t-option value="0" label="无图"></t-option>
                    <t-option value="1" label="单图" disabled></t-option>
                    <t-option value="2" label="两图" disabled></t-option>
                    <t-option value="3" label="三图" disabled></t-option>
                </t-select>
            </t-form-item>
            <t-form-item
                label="标签"
                name="tags"
                :rules="[{ required: true, type: 'error' }]"
            >
                <t-select
                    v-model="article.tags"
                    multiple
                    filterable
                    :max="3"
                    :options="tagOptions"
                    :keys="{ value: 'tagId', label: 'label' }"
                    placeholder="请输入关键字"
                />
            </t-form-item>
            <t-form-item
                label="分类"
                name="sortId"
                :rules="[{ required: true, type: 'error' }]"
            >
                <t-select
                    v-model="article.sortId"
                    :max="3"
                    :options="sortOptions"
                    :keys="{ value: 'sortId', label: 'content' }"
                    placeholder="请选择分类"
                />
            </t-form-item>
            <t-form-item
                label="密码"
                name="passwd"
                :rules="[
                    {
                        pattern: /^[A-Za-z0-9]{0,10}$/,
                        message: '只允许大小写字母与数字且最大10位',
                    },
                ]"
            >
                <t-input
                    v-model="article.passwd"
                    placeholder="无需密码请不要填写"
                />
            </t-form-item>
        </t-form>
    </t-dialog>
</template>

<script setup lang="tsx">
import { getSortListAll } from "@/api/sort";
import { getTagListAll } from "@/api/tag";
import { reactive, ref } from "vue";

import { storeToRefs } from "pinia";
import { getSettingStore } from "@/store";
import { createArticle } from "@/api/article";
const store = getSettingStore();
const { getWinWidth } = storeToRefs(store);

const props = defineProps<{
    show: boolean;
    articleData: { title: string; html: string; content: string };
}>();
const emits = defineEmits(["additionalClose", "createTagSuccess"]);
// 文章属性
const article = reactive({
    type: "",
    tags: [],
    html: "",
    sortId: "",
    passwd: "",
});

// 表单元素
const articleForm = ref();

// 标签选项
let tagOptions: { tagId: number; content: string; status: number }[] = reactive(
    []
);

// 分类选项
let sortOptions: { sortId: number; content: string }[] = reactive([]);

// 获取标签数据
getTagListAll().then(({ data }) => {
    tagOptions.push(
        ...data.map((item: { status: number; content: string }) => ({
            ...item,
            label: item.content,
            content: () => (
                <div>
                    {item.content}
                    <t-tag
                        size="small"
                        theme="warning"
                        v-show={item.status === 0}
                        class="ml-10"
                    >
                        审核
                    </t-tag>
                </div>
            ),
        }))
    );
});

// 获取分类数据
getSortListAll().then(({ data }) => {
    sortOptions.push(...data);
});

// 关闭事件
const close = () => {
    emits("additionalClose");
    // loading.value = false;
};

// 提交
const confirm = () => {
    articleForm.value.validate().then((validate: any) => {
        if (validate === true) {
            console.log({ ...article, ...props.articleData });
            createArticle({ status: 1, ...article, ...props.articleData }).then(
                (res) => {
                    console.log(res);
                }
            );
            // loading.value = true;
            // createTag(tagData)
            //     .then(({ data: { title, text } }) => {
            //         NotifyPlugin.success({
            //             title: title,
            //             content: text,
            //             closeBtn: true,
            //         });
            //         emits("createTagSuccess");
            //         close();
            //     })
            //     .catch(() => {
            //         loading.value = false;
            //     });
        }
    });
};

//*********************************************** */
const t = () => {
    console.log(article);
};
</script>

<style lang="scss" scoped>
.column {
    & :deep(.t-form__controls-content) {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
