const table = layui.table;
const util = layui.util;

table.render({
    elem: "#tags",
    height: 500,
    url: "/api/tag/list", //数据接口
    page: true, //开启分页
    cols: [
        [
            {
                field: "tagId",
                title: "ID",
                width: 100,
            },

            {
                field: "content",
                title: "内容",
            },
            {
                title: "使用次数",
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
                    return util.toDateString(createdAt, "yyyy-MM-dd HH:mm");
                },
            },
        ],
    ],
});
