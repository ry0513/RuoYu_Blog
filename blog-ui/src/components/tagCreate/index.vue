<template>
    <t-dialog
        v-model:visible="show"
        :closeOnOverlayClick="false"
        header="新建标签"
        :confirm-btn="{
            content: '确定',
            theme: 'primary',
            disabled: loading,
        }"
        :width="getWinWidth > 600 ? 580 : getWinWidth - 20"
        @confirm="confirm"
        @close="close"
    >
        <t-form ref="tagForm" :data="tagData" resetType="initial">
            <t-form-item
                label="标签"
                name="content"
                :rules="[
                    { required: true, type: 'error' },
                    {
                        max: 20,
                        type: 'error',
                    },
                ]"
            >
                <t-input
                    placeholder="请输入简短的标签"
                    v-model="tagData.content"
                />
            </t-form-item>
            <t-form-item
                label="原因"
                name="reason"
                :rules="[
                { validator: (val: string) => val.length <= 200, message: '原因最大长度为200',  }
            ]"
            >
                <t-input
                    placeholder="请简述原因（可为空）"
                    v-model="tagData.reason"
                />
            </t-form-item>
        </t-form>
    </t-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { NotifyPlugin } from "tdesign-vue-next";
import { createTag } from "@/api/tag";

import { getSettingStore } from "@/store";
import { storeToRefs } from "pinia";

const { getWinWidth } = storeToRefs(getSettingStore());

// 父子组件传值
defineProps<{ show: boolean }>();
const emits = defineEmits(["createTagClose", "createTagSuccess"]);

// 表单元素
const tagForm = ref();

// 关闭事件
const close = () => {
    emits("createTagClose");
    tagForm.value.reset();
    loading.value = false;
};

// 标签数据
const tagData = reactive({
    content: "",
    reason: "",
});

const loading = ref(false);

// 提交
const confirm = () => {
    tagForm.value.validate().then((validate: any) => {
        if (validate === true) {
            loading.value = true;
            createTag(tagData)
                .then(({ data: { title, text } }) => {
                    NotifyPlugin.success({
                        title: title,
                        content: text,
                        closeBtn: true,
                    });
                    emits("createTagSuccess");
                    close();
                })
                .catch(() => {
                    loading.value = false;
                });
        }
    });
};
</script>
