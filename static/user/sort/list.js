const table = layui.table;
const util = layui.util;

table.render({
    elem: "#sort",
    url: "/api/sort/list",
    page: true,
    cols: [
        [
            {
                field: "sortId",
                title: "ID",
                width: 100,
            },

            {
                field: "content",
                title: "分类",
            },
            {
                title: "文章数量",
                templet: ({ articles }) => {
                    return articles.length;
                },
            },
            {
                title: "创建者",
                templet: ({ user }) => {
                    return user.nickName;
                },
            },
            {
                title: "创建时间",
                templet: ({ createdAt }) => {
                    return util.toDateString(createdAt, "yyyy-MM-dd HH:mm:ss");
                },
            },
        ],
    ],
});
