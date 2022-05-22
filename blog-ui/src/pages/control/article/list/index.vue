<template>
    <t-card :bordered="false">
        <t-form ref="form" :data="formData" :label-width="80" layout="inline" colon>
            <t-form-item label="文章状态" name="status">
                <t-select v-model="formData.status" class="form-item-content" :options="ARTICLE_STATUS_OPTIONS"
                    clearable placeholder="请选择" />
            </t-form-item>
            <!-- <t-form-item label="合同名称" name="name">
                <t-input v-model="formData.name" class="form-item-content" type="search" placeholder="标题" clearable />
            </t-form-item> -->
        </t-form>
        <div class="table-container">
            <t-table :data="tableData" :columns="TABLE_COLUMNS" row-key="articleId" bordered :pagination="pagination">
                <template #sort="{ row }">
                    {{ row.sort?.content || "未分类" }}
                </template>
                <template #status="{ row }">
                    {{ getOptionsLabel(ARTICLE_STATUS_OPTIONS, row.status) }}
                </template>
                <template #tags="{ row }">
                    <t-tag theme="primary" class="tags" variant="light" v-for="(item, index) in row.tags" :key="index">
                        {{ item.content }}
                    </t-tag>
                </template>
                <template #password="{ row }">
                    {{ row.password || "无需密码" }}
                </template>
                <template #op="slotProps">
                    <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
                    <!-- <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a> -->
                </template>
            </t-table>
            <!-- <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选合同？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      /> -->
        </div>
    </t-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ARTICLE_STATUS_OPTIONS, getOptionsLabel } from "@/options/active";

const formData = ref({
    status: "",
    name: ""
});

const TABLE_COLUMNS = [
    { title: "ID", width: "100", align: "left", colKey: "articleId" },
    { title: "分类", width: "100", colKey: "sort" },
    { title: "标题", minWidth: "150", colKey: "title" },
    { title: "状态", width: "200", colKey: "status", cell: { col: "status" } },
    { title: "标签", width: "200", colKey: "tags", cell: { col: "tags" } },
    { title: "密码", width: "150", colKey: "password", cell: { col: "password" } },
    { title: "发布时间", width: "200", colKey: "releaseAt" },
    { align: "left", width: "200", colKey: "op", title: "操作" }
];

const pagination = ref({
    defaultPageSize: 20,
    total: 100,
    defaultCurrent: 1,
});

const tableData = ref([
    {
        articleId: 6,
        title: "mysql",
        status: 2,
        releaseAt: "2022-03-09T03:51:08.000Z",
        createdAt: "2022-03-09T03:51:08.000Z",
        password: "",
        tags: [
            {
                tagId: 1,
                content: "debian",
                tagArticle: {
                    tagId: 1,
                    articleId: 6,
                    createdAt: "2022-03-09T06:00:23.000Z",
                    updatedAt: "2022-03-09T06:00:23.000Z"
                }
            }
        ],
        sort: {
            sortId: 1,
            content: "全部"
        }
    },
    {
        articleId: 5,
        title: "使用UFW设置防火墙",
        status: 2,
        releaseAt: "2022-03-08T02:24:18.000Z",
        createdAt: "2022-03-08T02:24:18.000Z",
        password: "123",
        tags: [
            {
                tagId: 1,
                content: "debian",
                tagArticle: {
                    tagId: 1,
                    articleId: 5,
                    createdAt: "2022-03-08T03:12:29.000Z",
                    updatedAt: "2022-03-08T03:12:29.000Z"
                }
            }
        ],
        sort: {
            sortId: 1,
            content: "全部"
        }
    },
    {
        articleId: 4,
        title: "Git 常用命令",
        status: 0,
        releaseAt: null,
        createdAt: "2022-02-28T00:46:23.000Z",
        password: null,
        tags: [],
        sort: null
    },
    {
        articleId: 3,
        title: "debian安装redis",
        status: 2,
        releaseAt: "2022-02-19T09:18:17.000Z",
        createdAt: "2022-02-19T09:16:07.000Z",
        password: "",
        tags: [
            {
                tagId: 1,
                content: "debian",
                tagArticle: {
                    tagId: 1,
                    articleId: 3,
                    createdAt: "2022-02-22T09:18:17.000Z",
                    updatedAt: "2022-02-22T09:18:17.000Z"
                }
            },
            {
                tagId: 3,
                content: "redis",
                tagArticle: {
                    tagId: 3,
                    articleId: 3,
                    createdAt: "2022-02-22T09:18:17.000Z",
                    updatedAt: "2022-02-22T09:18:17.000Z"
                }
            }
        ],
        sort: {
            sortId: 1,
            content: "全部"
        }
    },
    {
        articleId: 2,
        title: "debian安装nvm和使用",
        status: 2,
        releaseAt: "2022-02-18T09:17:58.000Z",
        createdAt: "2022-02-17T09:15:55.000Z",
        password: "",
        tags: [
            {
                tagId: 1,
                content: "debian",
                tagArticle: {
                    tagId: 1,
                    articleId: 2,
                    createdAt: "2022-03-09T03:44:16.000Z",
                    updatedAt: "2022-03-09T03:44:16.000Z"
                }
            },
            {
                tagId: 4,
                content: "node",
                tagArticle: {
                    tagId: 4,
                    articleId: 2,
                    createdAt: "2022-03-09T03:44:16.000Z",
                    updatedAt: "2022-03-09T03:44:16.000Z"
                }
            }
        ],
        sort: {
            sortId: 1,
            content: "全部"
        }
    },
    {
        articleId: 1,
        title: "debian安装nginx",
        status: 2,
        releaseAt: "2022-02-16T09:15:43.000Z",
        createdAt: "2022-02-15T09:15:43.000Z",
        password: "",
        tags: [
            {
                tagId: 1,
                content: "debian",
                tagArticle: {
                    tagId: 1,
                    articleId: 1,
                    createdAt: "2022-02-22T09:17:40.000Z",
                    updatedAt: "2022-02-22T09:17:40.000Z"
                }
            },
            {
                tagId: 2,
                content: "nginx",
                tagArticle: {
                    tagId: 2,
                    articleId: 1,
                    createdAt: "2022-02-22T09:17:40.000Z",
                    updatedAt: "2022-02-22T09:17:40.000Z"
                }
            }
        ],
        sort: {
            sortId: 1,
            content: "全部"
        }
    }
]);

const onReset = (val: any) => {
    console.log(val);
};

const onSubmit = (val: any) => {
    console.log(val);
};

const rehandleClickOp = ({ text, row }: { text: any; row: any }) => {
    console.log(text, row);
};
</script>
<style lang="scss" scoped>
.form-item-content {
    width: 200px;
}

.tags {
    margin-right: 10px;
}
</style>
