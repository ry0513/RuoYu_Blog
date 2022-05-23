<template>
    <div class="editor">
        {{ valueHtml }}
        <Toolbar
            id="editor-toolbar"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
        />
        <Editor
            style="height: 700px"
            id="editor-content"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import {
    onBeforeUnmount,
    ref,
    shallowRef,
    onMounted,
    PropType,
    watchEffect,
    reactive
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps({
    valueHtml: {
        type: String,
        default: ""
    }
});

let valueHtml = "";
// watchEffect(() => {
//     valueHtml = props.valueHtml;
// });

const editorRef = shallowRef();
// 内容 HTML

// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = props.aaaHtml;
//     }, 1500);
// });

const toolbarConfig = {};
const editorConfig = {
    placeholder: "请输入内容...",
    scroll: false,
    MENU_CONF: {
        // 字体
        fontFamily: {
            fontFamilyList: [
                "黑体",
                "仿宋",
                "楷体",
                "标楷体",
                "宋体",
                "微软雅黑",
                "Arial",
                "Tahoma",
                "Verdana"
            ]
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
                { text: "Bash", value: "bash" }
                // 其他
            ]
        }
    }
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<style lang="scss" scoped>
.editor:not(.w-e-full-screen-container) {
    border: #e8e8e8 1px solid;
    width: 100%;
    #editor-toolbar {
        border-bottom: 1px solid #e8e8e8;
    }
    #editor-content {
        overflow-y: auto;
        background: #fff;
    }
}

.w-e-full-screen-container {
    background: #f1f1f1;
    z-index: 100;
    #editor-toolbar {
        border-bottom: 1px solid #e8e8e8;
        background: #fff;
        &:deep(.w-e-bar) {
            padding: 10px 0;
            margin: 0 auto;
            max-width: 1360px;
            // max-width: 500px;
            // justify-content: center;
        }
    }
    #editor-content {
        overflow-y: auto;
        &:deep(.w-e-text-container) {
            padding: 30px 50px;
            min-height: 1200px;
            height: auto;
            max-width: 950px;
            width: 100%;
            margin: 50px auto;
            background: #fff;
            box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
        }
        &:deep(.w-e-text-placeholder) {
            top: 47px;
            left: 60px;
        }
    }
}

@media screen and (max-width: 950px) {
    .w-e-full-screen-container {
        #editor-content {
            &:deep(.w-e-text-container) {
                margin: 0 auto;
                padding: 10px 20px 20px 20px;
            }
        }
    }
}
</style>
