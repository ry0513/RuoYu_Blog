<template>
    <t-card :bordered="false" class="ry-card">
        <div class="ry-card-filter">
            <div class="ry-card-filter_options">
                <span class="label">标签状态:</span>
                <t-select v-model="filter.status" :options="TAG_STATUS_OPTIONS" clearable placeholder="请选择标签状态" @change="getTagListData(true)" />
            </div>
            <div class="ry-card-filter_options">
                <span class="label">标签名称:</span>
                <t-input v-model="filter.content" clearable placeholder="请输入标签名称" @enter="getTagListData(true)" />
            </div>
            <div class="ry-card-filter_right">
                <t-button theme="primary" type="submit" @click="createTagShow = true">新增</t-button>
            </div>
        </div>

        <t-table :data="tableData.rows" :columns="TABLE_COLUMNS" row-key="tagId" hover bordered :loading="tableData.loading !== 0" :pagination="tableData.pagination" @page-change="onPageChange">
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
                <!-- <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a> -->
                <!-- <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a> -->
            </template>
        </t-table>
    </t-card>
    <Create :show="createTagShow" @createTagClose="createTagShow = false" @createTagSuccess="getTagListData(true)" />
</template>

<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from "vue";
import { TAG_STATUS_OPTIONS, getOptionsLabel } from "@/options/index";
import { toDate } from "@/utils/date";
import { getTagList } from "@/api/tag";
import pagination from "@/utils/pagination";

// 子组件-创建标签
import Create from "@/components/tagCreate/index.vue";
const createTagShow = ref(false);

// 筛选条件
const filter = reactive({
    status: "",
    content: "",
});

// 表格数据
const tableData = reactive({
    loading: 0,
    rows: [],
    pagination,
});

// 表格参数
const TABLE_COLUMNS = [
    { title: "ID", width: "80", align: "center", colKey: "tagId" },
    { title: "标签名称", width: "150", align: "center", colKey: "content" },
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

// 请求表格数据
const getTagListData = (first = false) => {
    if (first) {
        tableData.pagination.current = 1;
    }
    tableData.loading++;
    const { current, pageSize } = tableData.pagination;
    getTagList({ ...filter, current, pageSize }).then(({ data }) => {
        tableData.rows = data.rows;
        tableData.loading--;
        tableData.pagination.total = data.count;
    });
};

// 表格页数变化
const onPageChange = (pageInfo: pageChangeInfo) => {
    tableData.pagination.current = pageInfo.current;
    getTagListData();
};

const rehandleClickOp = ({ text, row }: { text: any; row: any }) => {
    console.log(text, row);
};

// 加载后
onMounted(() => {
    getTagListData();
});

const sss = () => {
    console.log(555);
};
</script>
