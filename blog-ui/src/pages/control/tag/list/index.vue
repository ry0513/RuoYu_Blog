<template>
    <t-card :bordered="false" class="ry-card">
        <div class="ry-card-filter">
            <div class="ry-card-filter_options">
                <span class="label">标签状态:</span>
                <t-select v-model="filter.status" :options="TAG_STATUS_OPTIONS" clearable placeholder="请选择" />
            </div>
            <div class="ry-card-filter_options">
                <span class="label">标签状态:</span>
                <t-select v-model="filter.status" :options="TAG_STATUS_OPTIONS" clearable placeholder="请选择" />
            </div>
            <div class="ry-card-filter_right">
                <t-button theme="primary" type="submit" @click="editShow = true">新建</t-button>
            </div>
        </div>

        <t-table :data="tableData" :columns="TABLE_COLUMNS" row-key="articleId" bordered :pagination="pagination">
            <template #count="{ row }">
                {{ row.articles.length }}
            </template>
            <template #status="{ row }">
                {{ getOptionsLabel(TAG_STATUS_OPTIONS, row.status) }}
            </template>
            <template #user="{ row }">
                {{ row.user.nickName }}
            </template>
            <template #createdAt="{ row }">
                {{ toDate(row.createdAt) }}
            </template>

            <template #op="slotProps">
                <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
                <!-- <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a> -->
            </template>
        </t-table>
        <t-dialog v-model:visible="editShow" :closeOnOverlayClick="false" header="对话框标题"
            :width="getWinWidth > 600 ? 600 : getWinWidth - 20" @confirm="confirm">
            <t-form ref="tagForm" :data="tagData">
                <t-form-item label="标签" name="content" :rules="[
                    {
                        required: true,
                        type: 'error',
                        trigger: 'blur',
                    },
                    {
                        max: 20,
                        type: 'error',
                        trigger: 'blur',
                    },
                ]">
                    <t-input placeholder="请输入简短的标签" v-model="tagData.content"></t-input>
                </t-form-item>
                <t-form-item label="原因" name="reason">
                    <t-input placeholder="请简述原因（可为空）" v-model="tagData.reason"></t-input>
                </t-form-item>
            </t-form>
        </t-dialog>
    </t-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TAG_STATUS_OPTIONS, getOptionsLabel } from "@/options/index";
import { toDate } from "@/utils/date";
import { getSettingStore } from "@/store";
import { storeToRefs } from "pinia";
import { addTag } from "@/api/tag";

const store = getSettingStore();
const { getWinWidth } = storeToRefs(store);

// 筛选条件
const filter = ref({
    status: "",
    name: "",
});

// 新建/编辑数据
const tagData = ref({
    content: "",
    reason: "",
});

const editShow = ref(false);
const tagForm = ref();
const confirm = () => {
    tagForm.value.validate().then((validate: any) => {
        if (validate === true) {
            console.log(tagData.value);
            addTag(tagData.value).then((res) => {
                console.log(res);
                editShow.value = false
            });
        }
    });
};

const TABLE_COLUMNS = [
    { title: "ID", width: "80", align: "center", colKey: "tagId" },
    { title: "标签", width: "150", align: "center", colKey: "content" },
    { title: "原因", width: "150", align: "center", colKey: "reason" },
    {
        title: "使用次数",
        width: "110",
        align: "center",
        colKey: "count",
        cell: { col: "count" },
    },
    {
        title: "状态",
        width: "100",
        align: "center",
        colKey: "status",
        cell: { col: "status" },
    },
    { title: "备注", width: "150", align: "center", colKey: "remark" },
    {
        title: "创建者",
        width: "150",
        align: "center",
        colKey: "user",
        cell: { col: "user" },
    },
    {
        title: "创建时间",
        width: "200",
        align: "center",
        colKey: "createdAt",
        cell: { col: "createdAt" },
    },
    {
        title: "操作",
        width: "150",
        align: "center",
        colKey: "op",
    },
];

const pagination = ref({
    defaultPageSize: 20,
    total: 100,
    defaultCurrent: 1,
});

const tableData = ref([
    {
        tagId: 5,
        content: "ufw",
        createdAt: "2022-04-21T00:57:55.000Z",
        status: 0,
        reason: "s",
        reply: null,
        user: {
            nickName: "若宇",
        },
        articles: [],
    },
    {
        tagId: 4,
        content: "node",
        createdAt: "2022-02-22T09:14:59.000Z",
        status: 0,
        reason: null,
        reply: null,
        user: {
            nickName: "若宇",
        },
        articles: [
            {
                articleId: 2,
                tagArticle: {
                    tagId: 4,
                    articleId: 2,
                    createdAt: "2022-03-09T03:44:16.000Z",
                    updatedAt: "2022-03-09T03:44:16.000Z",
                },
            },
        ],
    },
    {
        tagId: 3,
        content: "redis",
        createdAt: "2022-02-22T09:14:41.000Z",
        status: 0,
        reason: null,
        reply: null,
        user: {
            nickName: "若宇",
        },
        articles: [
            {
                articleId: 3,
                tagArticle: {
                    tagId: 3,
                    articleId: 3,
                    createdAt: "2022-02-22T09:18:17.000Z",
                    updatedAt: "2022-02-22T09:18:17.000Z",
                },
            },
        ],
    },
    {
        tagId: 2,
        content: "nginx",
        createdAt: "2022-02-22T09:14:36.000Z",
        status: 0,
        reason: null,
        reply: null,
        user: {
            nickName: "若宇",
        },
        articles: [
            {
                articleId: 1,
                tagArticle: {
                    tagId: 2,
                    articleId: 1,
                    createdAt: "2022-02-22T09:17:40.000Z",
                    updatedAt: "2022-02-22T09:17:40.000Z",
                },
            },
        ],
    },
    {
        tagId: 1,
        content: "debian",
        createdAt: "2022-02-22T09:14:31.000Z",
        status: 0,
        reason: null,
        reply: null,
        user: {
            nickName: "若宇",
        },
        articles: [
            {
                articleId: 1,
                tagArticle: {
                    tagId: 1,
                    articleId: 1,
                    createdAt: "2022-02-22T09:17:40.000Z",
                    updatedAt: "2022-02-22T09:17:40.000Z",
                },
            },
            {
                articleId: 2,
                tagArticle: {
                    tagId: 1,
                    articleId: 2,
                    createdAt: "2022-03-09T03:44:16.000Z",
                    updatedAt: "2022-03-09T03:44:16.000Z",
                },
            },
            {
                articleId: 3,
                tagArticle: {
                    tagId: 1,
                    articleId: 3,
                    createdAt: "2022-02-22T09:18:17.000Z",
                    updatedAt: "2022-02-22T09:18:17.000Z",
                },
            },
            {
                articleId: 5,
                tagArticle: {
                    tagId: 1,
                    articleId: 5,
                    createdAt: "2022-03-08T03:12:29.000Z",
                    updatedAt: "2022-03-08T03:12:29.000Z",
                },
            },
            {
                articleId: 6,
                tagArticle: {
                    tagId: 1,
                    articleId: 6,
                    createdAt: "2022-03-09T06:00:23.000Z",
                    updatedAt: "2022-03-09T06:00:23.000Z",
                },
            },
        ],
    },
]);

const rehandleClickOp = ({ text, row }: { text: any; row: any }) => {
    console.log(text, row);
};
</script>
<style lang="scss" scoped>
.table-container {
    margin-top: 20px;
}
</style>
